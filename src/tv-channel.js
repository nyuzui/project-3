import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";


export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.description = '';
    this.order = '';
    this.metadata = {};
    this.selected = false; 

  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      order: { type: Number },
      selected: { type: Boolean },
      timestamp: { type: Number },
      timecode: { type: Number },
      timerange: { type: Array }, // Added timerange property
      image: { type: String }, // Add image property to properties
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 5px;
        flex-direction: column;
        float: right;
        background-color:#433a27;
        transition: border 0.5s; 

      }
      .wrapper {
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 10px;
        padding-right: 10px;
        width: auto;
        background-image: linear-gradient(#a9b29e,#d5dbcf);
        border-radius: 8px;
        transition: height 0.5s; /* Add transition for height */

      }
      :host(.clicked) .wrapper {
        height: 150px; 
      }

    `;
  }

  // LitElement rendering template of your element
  render() {
    return html`
      <div>
        <div class="wrapper" @click="${this.handleClick}">
          <div style="display: flex; align-items: center;">
            <div style="flex-grow: 1;">
              <h3>${this.title}</h3>
              <h6>${this.description}</h6>
              <slot></slot>
            </div>
            <img src="${this.image}" alt="Channel Image" style="max-width: 50%; height: 100px; border-radius: 10px;">
          </div>
        </div>
      </div>`;
  }
  

  handleClick() {
    this.dispatchEvent(new CustomEvent('tv-channel-clicked', {
      detail: {
        metadata: this.metadata,
      },
    }));
  }
}


// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
