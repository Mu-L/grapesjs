import { Model } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { stringToPath } from '../../utils/mixins';

export const DataVariableType = 'data-variable';
export type DataVariableDefinition = {
  type: typeof DataVariableType;
  path: string;
  defaultValue?: string;
};

export default class DataVariable extends Model {
  em?: EditorModel;

  defaults() {
    return {
      type: DataVariableType,
      defaultValue: '',
      path: '',
    };
  }

  constructor(attrs: DataVariableDefinition, options: any) {
    super(attrs, options);
    this.em = options.em;
    this.listenToDataSource();
  }

  listenToDataSource() {
    const { path } = this.attributes;
    const resolvedPath = stringToPath(path).join('.');

    if (this.em) {
      this.listenTo(this.em.DataSources, `change:${resolvedPath}`, this.onDataSourceChange);
    }
  }

  onDataSourceChange() {
    const newValue = this.getDataValue();
    this.set({ value: newValue });
  }

  getDataValue() {
    const { path, defaultValue } = this.attributes;
    if (!this.em) {
      throw new Error('EditorModel instance is not provided for a data variable.');
    }
    const val = this.em?.DataSources.getValue(path, defaultValue);

    return val;
  }
}
