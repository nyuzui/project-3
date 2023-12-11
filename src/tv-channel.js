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
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      description: {type: String},
      order: {type: Number},
      selected: { type: Boolean },
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
        background-color: #C6AC8F;
      }

      :host([selected]) .wrapper {
        background-color: #3498db;
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

    `;
  }
  
  // LitElement rendering template of your element
  render() {
    return html`
    <div>
      <div class="wrapper">
        <h3>${this.title}</h3>
        <h6>${this.description}</h6>
        <h6>${this.order}</h6>
        <slot></slot>
      </div> 
    </div>  
 
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
