import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TailwindElement } from "./shared/tailwind.element";

@customElement("coupons-new")
export class couponsNewComponent extends TailwindElement() {
	@property()
	name?: string = "Worldee";

	render() {
		return html`
      <div class="">
        <h2 class="text-2xl font-bold">Create Coupons</h2>
        <div class="mt-8 max-w-md">
          <div class="grid grid-cols-1 gap-6">
            <label class="block">
              <span class="text-gray-700">Player Name</span>
              <input
                type="text"
                class="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                placeholder="Jørgen Skogmo"
                id="player"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Number of coupons</span>
              <input
                type="number"
                class="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                value="10"
                id="count"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Lives pr coupon</span>
              <input
                type="number"
                class="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                value="3"
                id="lives"
              />
            </label>

            <button class="btn w-min btn-success">Generate&nbsp;(Free)</button>
            <button class="btn w-min btn-active btn-primary">Generate&nbsp;(Pay)</button>

          </div>
        </div>
      </div>
`;
	}
}
