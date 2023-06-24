import prompts from 'prompts';
import { PackageManager } from '../pacakge-manager';
import { Tool } from '../tool';

export class Framework {
  protected _packageManager: PackageManager;
  protected _toolsToBeInstalled: Tool[];
  protected tools: Tool[] = [];

  get packageManager(): PackageManager {
    return this._packageManager;
  }

  get toolsToBeInstalled(): Tool[] {
    return this._toolsToBeInstalled;
  }

  constructor(packageManager: PackageManager, tools: Tool[] = []) {
    this._packageManager = packageManager;
    this.tools = tools;
  }

  async install(): Promise<void> {
    if (this.tools.length === 0) {
      console.log('No tools can install.');
      return;
    }

    const tools = this.tools;
    const {
      toolsToBeInstalled,
    }: {
      toolsToBeInstalled: Tool[];
    } = await prompts({
      type: 'multiselect',
      name: 'toolsToBeInstalled',
      message: 'Which tools do you want to install?',
      onRender() {
        this.value.forEach((choice) => {
          if (choice.value.selected !== choice.selected) {
            choice.value.selected = choice.selected;
          }
        });
        this.value = tools.map((tool) => tool.promptChoices).flat();
      },
    });

    if (!toolsToBeInstalled || toolsToBeInstalled.length === 0) {
      console.log('No tools to be installed.');
      return;
    }

    this._toolsToBeInstalled = toolsToBeInstalled;
    this._toolsToBeInstalled.forEach(async (tool) => {
      await tool.install(this);
    });
  }
}
