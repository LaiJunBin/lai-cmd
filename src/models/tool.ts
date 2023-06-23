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

    public build(): Tool {
      return new Tool(this.install, this.promptChoice);
    }
  };

  private constructor(
    public install: (framework: Framework) => Promise<void> = async () => {
      throw new Error('Method not implemented.');
    },
    public promptChoice: Choice
  ) {
    this.promptChoice = {
      ...this.promptChoice,
      value: this,
    };
  }
}
