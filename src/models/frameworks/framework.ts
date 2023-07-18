import prompts from 'prompts';
import { PackageManager } from '../package-manager';
import { Tool } from '../tool';

export class Framework {
  protected _packageManager: PackageManager;
  protected _toolsToBeInstalled: Tool[];
  protected tools: Tool[] = [];
  private static frameworks: { [key: string]: typeof Framework } = {};

  get packageManager(): PackageManager {
    return this._packageManager;
  }

  get toolsToBeInstalled(): Tool[] {
    return this._toolsToBeInstalled;
  }

  static list() {
    return Object.keys(this.frameworks);
  }

  static get(name: string) {
    return this.frameworks[name];
  }

  static register(name: string, framework: typeof Framework) {
    Framework.frameworks[name] = framework;
  }

  static async check(): Promise<boolean> {
    return true;
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
    for (const tool of this._toolsToBeInstalled) {
      if (tool.promptChoice.disabled) continue;
      await tool.install(this);
    }
  }
}
