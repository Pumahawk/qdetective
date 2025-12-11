type UpdateModelFnType<T, R> = (model: T) => R;

export interface ComponentDependency<T, R> {
  component: BaseComponent<R>;
  updateFn: (model: T) => R;
}

export abstract class BaseComponent<T> extends HTMLElement {
  _dependencies: ComponentDependency<T, unknown>[] = [];

  abstract updateInternalModel(_: T): void;

  update(model: T) {
    this.updateInternalModel(model);
    this._dependencies.forEach(({ component, updateFn }) =>
      component.update(updateFn(model))
    );
  }

  loadComponent<E extends BaseComponent<unknown>, M>(
    name: string,
    updateFn: UpdateModelFnType<unknown, M>,
  ): E | null {
    const el = this?.querySelector<E>(name);
    if (el) {
      this._dependencies.push({
        component: el,
        updateFn,
      });
    }
    return el;
  }
}
