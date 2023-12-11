//tv-app.js
import { LitElement, html, css } from 'lit';
import './tv-channel.js';

import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/video-player/video-player.js";

// import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/button-group/button-group.js';

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeItem = {
      title: null,
      id: null,
      description: null,
    };
  }

  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }

  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object }
    };
  }

  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 16px;
          padding: 16px;
        }
        .container {
          display: flex;
          flex-direction: row;
        }
        .video-container {
          padding: 20px;
          width: 50%;
          height: auto;
          overflow: hidden;
          background-image: linear-gradient(#C6AC8F, #EAE0D5);

          border-radius: 10px; 
          margin: 16px;
        }
        .container-2 {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          max-height: 700px;
          border: 5px solid #C6AC8F; /* Optional: Add a border for visual clarity */
          border-radius: 10px; /* Optional: Add rounded corners for aesthetics */
        }
        .controls-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          padding: 20px;
          margin: 3px;
        }
        .lecture-info {
          width: auto;
          height: auto;
          font-size: 16px;
          background-image:linear-gradient( #EAE0D5, #ffffff);
          padding:16px;
          white-space: pre-line; 
          border-radius: 10px; 
        }
      `
    ];
  }

  // LitElement rendering template of your element
  render() {
    return html`
      <!-- VIDEO / BUTTON / INFO DIV -->
      <div>Awesome Final Project</div>
      <div class="container">
        <div class="video-container">
          <div>
            <video-player id="video1" source="https://www.youtube.com/watch?v=vwqi9s2XSG8" accent-color="#C6AC8F" dark track="https://haxtheweb.org/files/HAXshort.vtt">
            </video-player>
        </div>

          <div class="controls-container">
          <sl-button variant="neutral" outline @click="${() => this.showPrevious(this.activeItem)}">Previous</sl-button>
          <sl-button variant="neutral" outline @click="${() => this.showNext(this.activeItem)}">Next</sl-button>
          </div>

          <div class="lecture-info">
           <h2> ${this.activeItem.title} </h2>
           ${this.activeItem.description}
          </div>
        </div>

        <!-- second container -->
        <div class="container-2">
          ${
            this.listings.map(
              (item) => html`
                <tv-channel
                  id="${item.id}"
                  title="${item.title}"
                  description="${item.description}"
                  @click="${this.itemClick}"
                >
                </tv-channel>
              `
            )
          }
        </div>

      </div>

      <sl-dialog label="Lecture Information" class="dialog">
        ${this.activeItem.title}
        <sl-button slot="footer" @click="${this.dummyButtonClock}">Play video </sl-button>
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
      </sl-dialog>
    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }
  // button that opens video from dialogue
  dummyButtonClick() {

  }

  itemClick(e) {
    console.log(e.target);
    this.activeItem = {
      title: e.target.title,
      id: e.target.id,
      description: e.target.description,
    };
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }
  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
        console.log(this.listings);
      }
    });
  }

  // next prev button wiring
  showNext() {
    const currentIndex = this.listings.findIndex(item => item.id === this.activeItem.id);
    const nextIndex = (currentIndex + 1) % this.listings.length;
    this.activeItem = this.listings[nextIndex];
  }

  showPrevious() {
    const currentIndex = this.listings.findIndex(item => item.id === this.activeItem.id);
    const previousIndex = (currentIndex - 1 + this.listings.length) % this.listings.length;
    this.activeItem = this.listings[previousIndex];
  }
}


// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
