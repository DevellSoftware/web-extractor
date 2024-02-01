import { Injectable } from "@container/decorators/injectable.decorator";
import { Bar } from "./bar";
import { Zap } from "./zap";

@Injectable()
export class Biz {
  constructor(bar: Bar, zap: Zap) {}
}
