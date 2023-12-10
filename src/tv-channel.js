// tv-channel.js
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
    this.presenter = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      presenter: { type: String },
      description: {type: String},
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 6px;
        flex-direction: column;
        float: right;

      }
      .wrapper {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left:5px;
        padding-right:5px;
         width: 300px;
        background-color: #eae0d5;
      }

    `;
  }
  
  // LitElement rendering template of your element
  render() {
    return html`
    <div>
      <div class="wrapper">
        <h3>${this.title}</h3>
        <h6>${this.presenter}</h6>
        <h6>${this.description}</h6>
        <slot></slot>
      </div> 
    </div>  
 
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
