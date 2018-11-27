import {
  ComponentType,
  createElement,
  ReactElement,
  ReactNode,
  ReactNodeArray,
  SyntheticEvent,
} from 'react';
import connectToParentField from '../hooks/connectToParentField';
import useField, { IField as FieldAPI } from '../hooks/useField';
import useParentField from '../hooks/useParentField';

type FieldRenderFn = (field: FieldAPI<void | string>) => ReactNode;

interface IProps {
  as?: string | ComponentType<any>;
  debounceDelay?: number;
  children?: void | ReactNode | ReactNodeArray | FieldRenderFn;
  name: string | number;
  [key: string]: any;
}

export default function Field({
  as = 'input',
  children = null,
  debounceDelay = 300,
  name,
  ...rest
}: IProps) {
  const parentField = useParentField();
  const field = connectToParentField(name, parentField, useField, {
    debounceDelay,
  });

  if (typeof children === 'function') {
    return (children as FieldRenderFn)(field) as ReactElement<any> | null;
  }

  function onBlur() {
    field.setFocused(false);
  }

  function onFocus() {
    field.setFocused(true);
  }

  function onChange(e: SyntheticEvent<HTMLInputElement>) {
    field.setValue(e.currentTarget.value);
  }

  return createElement(as, {
    ...rest,
    children,
    name,
    onBlur,
    onChange,
    onFocus,
    value: field.value,
  });
}
