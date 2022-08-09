import { HTMLElement, parse } from 'node-html-parser'
import { ExtractionSet, SourceBlock } from './types/pipeline-entities'
import { baseStringFormatter } from './pipes/formatters/base-string.formatter'
import { from, map, Observable } from 'rxjs'
import { Injectable, Logger } from '@nestjs/common'
import { CheckedEnquiry } from './types/parser-payload'
import { OdysseyClient } from '../app/client/odyssey.client'

@Injectable()
export class SourceExtractor {
  private output: ExtractionSet = new Set<SourceBlock>()

  constructor(private client: OdysseyClient, private log: Logger) {}

  extract(rawData: string): Observable<SourceBlock> {
    this.output.clear()
    const bodyNode = this.extractBodyElement(parse(rawData)) // TODO: htmlparser2
    this.parseHtmlNodes(bodyNode.querySelectorAll('.statbox'))
    return from(this.output)
  }

  public async fromEnquiry({
    id,
    meta: { method, fields, odyssey },
  }: CheckedEnquiry): Promise<Observable<SourceBlock>> {
    if (!odyssey.resultUrl)
      throw Error('Source must contain raw html to extract')
    const raw = await this.client.fetch(odyssey.resultUrl)
    return this.extract(raw).pipe(
      map((block: SourceBlock) => ({
        ...block,
        enquiryRef: { id, method, fields },
      }))
    )
  }

  private extractBodyElement(document): HTMLElement {
    const bodyElementFinder = document.childNodes
      .filter((it) => this.isHTMLElement(it))
      .shift()
      .childNodes.filter(
        (it) => this.isHTMLElement(it) && it.rawTagName === 'body'
      )

    return new HTMLElement('body', {}, '', null).set_content(bodyElementFinder)
  }

  private parseHtmlNodes(nodes: HTMLElement[]) {
    nodes.forEach((htmlBlock) => {
      this.output.add({
        title: baseStringFormatter(this.extractSourceBlockTitle(htmlBlock)),
        body: this.extractSourceBlockContent(htmlBlock),
      })
    })
  }

  private extractSourceBlockTitle(htmlEl: HTMLElement): string {
    return htmlEl.querySelector('h4').textContent
  }

  private extractSourceBlockContent(htmlEl: HTMLElement): [string, string][] {
    let reduceCounter = -1
    return htmlEl
      .querySelectorAll('table td')
      .map((cell) => {
        if (cell.querySelector('table')) {
          return null
        }

        return cell.structuredText
      })
      .reduce((collector, current, index) => {
        if (index % 2 === 0) {
          collector.push([current])
          reduceCounter++
        } else {
          collector[reduceCounter].push(current)
        }
        return collector
      }, [])
      .filter(([label, value]) => !!label && !!value)
  }

  private isHTMLElement(node): boolean {
    return node instanceof HTMLElement
  }
}
