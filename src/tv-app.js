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
      metadata: {},
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
          width: 60%;
          height: auto;
          overflow: hidden;
          background-image:linear-gradient(#433a27,#756c4a);

          border-radius: 10px; 
          margin: 16px;
        }
        .container-2 {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          max-height: 700px;
          width: 40%;
          border-radius: 10px;
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
          background-image: linear-gradient(#a9b29e,#d5dbcf);
          padding: 16px;
          white-space: pre-line;
          border-radius: 10px; 
        }
        tv-channel.clicked {
        border: 6px solid #d5dbcf;
        padding: 0px;
        box-sizing: border-box; 
        border-radius: 15px;
       }
        tv-channel:hover {
          cursor: pointer;
          color: #433a27;
        }
        sl-button{
          background-image: linear-gradient(#a9b29e,#d5dbcf);
        }
      `
    ];
  }

  // LitElement rendering template of your element
  render() {
    return html`
      <!-- VIDEO / BUTTON / INFO DIV -->
      <div class="container">
        <div class="video-container">
          <div>
            <video-player id="video1" 
            source="https://www.youtube.com/watch?v=vwqi9s2XSG8" 
            accent-color="#C6AC8F" 
            dark track="https://haxtheweb.org/files/HAXshort.vtt"
            @time-updated="${this.handleVideoTimeUpdate}">
          </video-player>
          </div>

          <div class="controls-container">
            <sl-button variant="neutral" outline @click="${() => this.showPrevious(this.activeItem)}">Previous</sl-button>
            <sl-button variant="neutral" outline @click="${() => this.showNext(this.activeItem)}">Next</sl-button>
          </div>

          <div class="lecture-info">
            <h2>${this.activeItem.title}</h2>
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
                  timestamp="${item.timestamp}"
                  .timerange="${item.timerange}"  
                  ?selected="${item.selected}"
                  @tv-channel-clicked="${this.itemClick}"
                  class="${this.activeItem.id === item.id ? 'clicked' : ''}"
                >
                </tv-channel>
              `
            )
          }
        </div>
      </div>

      <sl-dialog label="Lecture Information" class="dialog">
        ${this.activeItem.title}
        <sl-button slot="footer" @click="${this.playVideo}">Play video </sl-button>
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
      </sl-dialog>
    `;
  }

  closeDialog() {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    const previouslyClickedItem = this.shadowRoot.querySelector('.clicked');
    if (previouslyClickedItem) {
      previouslyClickedItem.classList.remove('clicked');
    }
  
    e.target.classList.add('clicked');
  
    const clickedItem = this.listings.find((item) => item.id === e.target.id);
  
    this.activeItem = {
      title: clickedItem.title,
      id: clickedItem.id,
      description: clickedItem.description,
      metadata: clickedItem.metadata,
    };
  
    this.timecode = clickedItem.metadata.timecode; // Update the timecode property
  
    this.updateVideoPlayer();
  }

  updateVideoPlayer() {
    const videoPlayer = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player');

    // Set the video source based on the active item's metadata
    videoPlayer.source = this.activeItem.metadata.source;

    // Play the video
    videoPlayer.play();

    // Seek to a specific time (e.g., the time specified in metadata)
    videoPlayer.seek(this.activeItem.metadata.timecode);
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
      }
    });
  }
  
  handleVideoTimeUpdate(e) {
    const currentTime = e.detail.currentTime;

    // Find the channel with the corresponding time range
    const activeChannel = this.listings.find((channel) => {
      const [start, end] = channel.timerange;
      return currentTime >= start && currentTime <= end;
    });

    if (activeChannel) {
      this.activeItem = {
        title: activeChannel.title,
        id: activeChannel.id,
        description: activeChannel.description,
        metadata: activeChannel.metadata,
      };
    }
  }

  showNext() {
    const currentIndex = this.listings.findIndex(item => item.id === this.activeItem.id);
    const nextIndex = (currentIndex + 1) % this.listings.length;
    this.listings.forEach(item => item.selected = false); // Deselect all channels
    this.listings[nextIndex].selected = true; // Select the next channel
    this.activeItem = this.listings[nextIndex];
    this.updateVideoPlayer();
  }

  showPrevious() {
    const currentIndex = this.listings.findIndex(item => item.id === this.activeItem.id);
    const previousIndex = (currentIndex - 1 + this.listings.length) % this.listings.length;
    this.listings.forEach(item => item.selected = false); // Deselect all channels
    this.listings[previousIndex].selected = true; // Select the previous channel
    this.activeItem = this.listings[previousIndex];
    this.updateVideoPlayer();
  }

  

  updateActiveItem(index) {
    const previouslyClickedItem = this.shadowRoot.querySelector('.clicked');
    if (previouslyClickedItem) {
      previouslyClickedItem.classList.remove('clicked');
    }

    const newActiveItem = this.listings[index];
    const newActiveItemElement = this.shadowRoot.querySelector([id="${newActiveItem.id}"]);

    if (newActiveItemElement) {
      newActiveItemElement.classList.add('clicked');
    }

    this.activeItem = newActiveItem;
    this.updateVideoPlayer();
  }

}
customElements.define(TvApp.tag, TvApp);