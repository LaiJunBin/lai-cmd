import { Framework } from './frameworks/framework';

interface Choice {
  title: string;
  value?: Tool;
  disabled?: boolean | undefined;
  selected?: boolean | undefined;
  description?: string | undefined;
}

export class Tool {
  public static Builder = class {
    private install: (framework: Framework) => Promise<void>;
    private promptChoice: Omit<Choice, 'value'>;
    private children: Tool[] = [];

    public setInstall(install: typeof this.install): typeof this {
      this.install = install;
      return this;
    }

    public setPromptChoice(
      promptChoice: typeof this.promptChoice
    ): typeof this {
      this.promptChoice = promptChoice;
      return this;
    }

    public setChildren(children: Tool[]): typeof this {
      this.children = children;
      return this;
    }

    public build(): Tool {
      const indentChildren = (children: Tool[]): Tool[] => {
        children.forEach((child) => {
          child.promptChoice.title = `  ${child.promptChoice.title}`;
          indentChildren(child.children);
        });
        return children;
      };

      this.children = indentChildren(this.children);
      return new Tool(this.install, this.promptChoice, this.children);
    }
  };

  public selected: boolean;
  private constructor(
    public install: (framework: Framework) => Promise<void> = async () => {
      throw new Error('Method not implemented.');
    },
    public promptChoice: Choice,
    public children: Tool[]
  ) {
    this.promptChoice = {
      ...this.promptChoice,
      value: this,
    };
  }

  get promptChoices(): Choice[] {
    if (this.selected) {
      return [
        this.promptChoice,
        ...this.children.map((child) => child.promptChoices).flat(),
      ].flat();
    }

    return [this.promptChoice].flat();
  }
}
