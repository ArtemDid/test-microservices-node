import { getLogger } from '../../common/logging';
import { isWebUri } from 'valid-url';
import { IUrlsDb } from './urls-job.types';

export const parseHTML = (html: string): Array<string> => {
  const anchors = [];
  const dom = html.match(/<a[^>]*href=["']([^"']*)["']/g);

  if (dom?.length)
    dom.map(item => {
      anchors.push(item.split(/['"]+/)[1]);
    });

  return anchors;
};

const isURL = (href: string) => {
  const log = getLogger();

  if (isWebUri(href)) {
    try {
      const url = new URL(href);
      const newUrl: string = url.origin + url.pathname;

      return newUrl.replace(/(.+)(\/|#)$/, '$1');
    } catch (error) {
      log.error('URL invalid');
    }
  }

  return '';
};

export const parseHref = (href: string, domain: string): string => {
  const newUrl = isURL(href);

  return newUrl || (href.startsWith('//') ? isURL(`https:${href}`) : href[0] === '/' ? isURL(`${domain}${href}`) : '');
};
