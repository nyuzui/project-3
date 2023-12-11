import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

export class TvChannel extends LitElement {
  constructor() {
    super();
    this.title = '';
    this.description = '';
    this.timestamp = '';
    this.highlighted = false;
  }

  static get tag() {
    return 'tv-channel';
  }

  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      timestamp: { type: String },
      highlighted: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 5px;
        flex-direction: column;
        float: right;
        background-color: #C6AC8F;
      }

      .wrapper {
        padding-top: 2px;
        padding-bottom: 2px;
        padding-left:5px;
        padding-right:5px;
        width: 300px;
        background-image:linear-gradient( #EAE0D5, #ffffff);
        border-radius: 5px; 
      }

      .wrapper.highlighted {
        background-color: #ffcc00;
      }
    `;
  }

  render() {
    return html`
      <div>
        <div class="wrapper ${this.highlighted ? 'highlighted' : ''}">
          <h3>${this.title}</h3>
          <h6>${this.description}</h6>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define(TvChannel.tag, TvChannel);