// import stuff
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

import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/button-group/button-group.js';

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
          flex-direction: column;
        }
        .video-container {
          padding: 20px;
          width: 60%; /* Adjust width as needed */
          height: 670px;
          overflow: hidden;
        }
        .text-box {
          margin-top: 16px;
        }
        .controls-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow:hidden;
          padding: 20px;
          margin: 3px;
        }
        .button-container {
          align-items: center;
          padding: 20px;
          width: 30%; /* Adjust width as needed */
          height: 670px;
          overflow: hidden;
        }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <h2>${this.name}</h2>
      ${
        this.listings.map(
          (item) => html`
            <tv-channel
              id="${item.id}"
              title="${item.title}"
              presenter="${item.metadata.author}"
              description="${item.description}"
              @click="${this.itemClick}"
            >
            </tv-channel>
          `
        )
      }

      <div class="container">
        <div class="video-container">
          <div>
            ${this.activeItem.name}
            ${this.activeItem.description}
            <video-player id="video1" source="https://www.youtube.com/watch?v=XsMFJT-Vna4" accent-color="purple">
            </video-player>
          </div>

          <div class="controls-container">
            <sl-button variant="default" size="medium">Previous</sl-button>
            <sl-button variant="default" size="medium">Next</sl-button>
          </div>
        </div>

        <div class="button-container">
          <div>
            <sl-button variant="default" size="medium" style="width: 100%; margin-bottom: 1rem;">B1</sl-button>
            <sl-button variant="default" size="medium" style="width: 100%; margin-bottom: 1rem;">B2</sl-button>
            <sl-button variant="default" size="medium" style="width: 100%; margin-bottom: 1rem;">B3</sl-button>
            <sl-button variant="default" size="medium" style="width: 100%; margin-bottom: 1rem;">B4</sl-button>
            <sl-button variant="default" size="medium" style="width: 100%; margin-bottom: 1rem;">B5</sl-button>
          </div>
        </div>
      </div>
        
        

      dialog 
      <sl-dialog label="Dialog" class="dialog">
        ${this.activeItem.title}
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
      </sl-dialog>
   
    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
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
}

// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
