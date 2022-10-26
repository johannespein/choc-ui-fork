import {
  forwardRef,
  Input,
  InputProps,
  SystemStyleObject,
  useMergeRefs,
  useMultiStyleConfig,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { runIfFn } from "@chakra-ui/utils";
import { MaybeRenderProp } from "@chakra-ui/react-utils";
import React from "react";

import { useAutoCompleteContext } from "./autocomplete-context";
import { UseAutoCompleteReturn } from "./types";

export interface AutoCompleteInputProps extends Omit<InputProps, "children"> {
  children?: MaybeRenderProp<{ tags: UseAutoCompleteReturn["tags"] }>;
  wrapStyles?: SystemStyleObject;
  hidePlaceholder?: boolean;
}

export const AutoCompleteInput = forwardRef<AutoCompleteInputProps, "input">(
  (props, forwardedRef) => {
    const {
      autoCompleteProps,
      inputRef,
      getInputProps,
      tags,
    } = useAutoCompleteContext();

    // const ref = useMergeRefs(forwardedRef, inputRef);

    const {
      children: childrenProp,
      isInvalid,
      hidePlaceholder,
      ...rest
    } = props;

    const themeInput: any = useMultiStyleConfig("Input", props);

    const { wrapper, input } = getInputProps(rest, themeInput);
    const { ref: wrapperRef, ...wrapperProps } = wrapper;
    const ref = useMergeRefs(forwardedRef, inputRef);

    const children = runIfFn(childrenProp, { tags });
    const inputProps = {
      ...input,
      placeholder:
        hidePlaceholder && Array.isArray(children) && children.length
          ? ""
          : input.placeholder,
    };

    const simpleInput = (
      <Input isInvalid={isInvalid} {...(inputProps as any)} ref={ref} />
    );

    const multipleInput = (
      <Wrap {...wrapperProps} ref={wrapperRef}>
        {children}
        <WrapItem as={Input} {...(inputProps as any)} ref={ref} />
      </Wrap>
    );

    return <>{autoCompleteProps.multiple ? multipleInput : simpleInput}</>;
  }
);

AutoCompleteInput.displayName = "Input";

AutoCompleteInput.id = "Input";
