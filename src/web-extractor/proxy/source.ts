import { Proxy } from "@web-extractor/proxy/proxy";

export abstract class Source {
  abstract load(): Promise<Proxy[]>;
}
