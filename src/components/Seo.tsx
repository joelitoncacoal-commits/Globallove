import React, { useEffect } from 'react';
import { applyDocumentSEO, resolveRouteSEO, RouteSEOPayload } from '../utils/seo';
import { SupportedLang } from '../types';

export interface SeoProps {
  path: string;
  lang: SupportedLang;
  title?: string;
  description?: string;
  keywords?: string;
  noindex?: boolean;
  nofollow?: boolean;
  jsonLd?: Record<string, unknown>;
}

export const Seo: React.FC<SeoProps> = ({
  path,
  lang,
  title,
  description,
  keywords,
  noindex,
  nofollow,
  jsonLd,
}) => {
  useEffect(() => {
    const resolved: RouteSEOPayload = resolveRouteSEO(path, lang);
    applyDocumentSEO({
      ...resolved,
      title: title || resolved.title,
      description: description || resolved.description,
      keywords: keywords ?? resolved.keywords,
      noindex: noindex ?? resolved.noindex,
      nofollow: nofollow ?? resolved.nofollow,
      jsonLd: jsonLd ?? resolved.jsonLd,
    });
  }, [path, lang, title, description, keywords, noindex, nofollow, jsonLd]);

  return null;
};
