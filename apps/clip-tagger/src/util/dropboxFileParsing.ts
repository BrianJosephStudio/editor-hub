const fileNameRegex = /^\d+\.\d+_\w+_\w+_\d+\.\w+$/

export class ParsedFileName {
    public isProperlyNamed: boolean = false;
    public path: string;
    public filePath: string;
    public trueFilePath: string;
    public name: string;
    public trueName: string;
    public patch: string;
    public agent: string;
    public map: string;
    public index: number;
    public extension: string
  
    constructor(filePath: string, currentFileIndex: number) {
      this.filePath = filePath;
      const path = filePath.split("/").filter((data) => data);
  
      this.name = path.pop()!;
      this.extension = this.name.split('.').pop()!;
      this.path = `/${path.join("/")}`;
      this.map = path.pop()!;
      this.agent = path.pop()!;
      this.patch = path.pop()!;
  
      const parsedFileName = this.name.split("_").filter((data) => data);
      const parsedIndex = parseInt(parsedFileName.pop()!.split(".")[0]!);
      
      this.isProperlyNamed = fileNameRegex.test(this.name)
  
      if (typeof parsedIndex != "number") {
        throw new Error();
      }
  
      console.log("properly named", this.isProperlyNamed);
  
      if (this.isProperlyNamed) {
        this.index = parsedIndex;
        this.trueName = this.name;
        this.trueFilePath = this.filePath;
      } else {
        this.index = currentFileIndex;
        this.trueName = `${this.patch}_${this.agent}_${this.map}_${this.index}.${this.extension}`;
        this.trueFilePath = `${this.path}/${this.trueName}`;
      }
    }
  
    public getrenameObject = () => {
      return { from_path: this.filePath, to_path: this.trueFilePath };
    };
  }
  