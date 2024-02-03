import { Proxy } from "@web-extractor/proxy/proxy";
import { Source } from "@web-extractor/proxy/source";
import * as dotenv from "dotenv";

dotenv.config();

export class WebshareSource extends Source {
  async load(): Promise<Proxy[]> {
    const result: Proxy[] = [];

    const response = await fetch(process.env.WEBSHARE_API_URL || "");

    if (!response.ok) {
      throw new Error("Failed to fetch proxies from Webshare");
    }

    const text = await response.text();

    for (const line of text.split("\n")) {
      const [ip, port, username, password] = line.split(":");
      const proxy = {
        address: ip,
        port: parseInt(port, 10),
        username,
        password,
      };

      result.push(proxy);
    }

    return result;
  }
}
