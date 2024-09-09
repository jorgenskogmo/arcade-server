import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TailwindElement } from "./shared/tailwind.element";

@customElement("highscores-list")
export class highscoresListComponent extends TailwindElement() {
	@property()
	game?: string = "speedclick";

	data = undefined;
	reloadInterval = undefined;
	datasource = "http://127.0.0.1:5555/highscores/list";

	async firstUpdated() {
		await this.fetchData();
		this.reloadInterval = setInterval(() => {
			this.fetchData();
		}, 1000);
	}

	async fetchData() {
		console.log("loading", `${this.datasource}?game=${this.game}`);
		this.data = await fetch(`${this.datasource}?game=${this.game}`).then(
			(res) => res.json(),
		);
		console.log(this.data);
		this.requestUpdate();
	}

	render() {
		if (!this.data) {
			return `loading highscores for game ${this.game}`;
		}

		return html`
      <div class="">
        <h2 class="text-2xl font-bold">highscores for <span class="text-primary">${this.game}</span></h2>
        <div class="mt-8">
          
        <table class="table table-zebra">
    <!-- head -->
    <thead>
      <tr>
        <th>Rank</th>
        <th>Player</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      
        
        ${this.data.map(
					(d, i) => html`
      <tr class="${i === 0 ? "bg-primary text-white font-bold" : ""}">
        <th>${i + 1}</th>
        <td>${d.player}</td>
        <td>${d.score}</td>
      </tr>`,
				)}
        </tbody>
      </table>
          
      </div>
`;
	}
}
