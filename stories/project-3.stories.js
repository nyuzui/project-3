import { html } from 'lit';
import '../src/project-3.js';

export default {
  title: 'Project3',
  component: 'project-3',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <project-3
      style="--project-3-background-color: ${backgroundColor || 'white'}"
      .header=${header}
    >
    </project-3>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
