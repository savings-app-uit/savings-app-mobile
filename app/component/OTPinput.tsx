import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
} from "react-native";

interface OTPInputProps {
  code: string;
  setCode: (value: string) => void;
  setPinReady?: (ready: boolean) => void;
  maxLength: number;
}

export default function OTPInput({
  code,
  setCode,
  maxLength,
}: OTPInputProps) {
  const textInputRef = useRef<TextInput>(null);
  const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);

  const codeDigitsArray = new Array(maxLength).fill(0);

  const handleOnPress = () => {
    setInputContainerIsFocused(true);
    textInputRef?.current?.focus();
  };

  const handleOnBlur = () => {
    setInputContainerIsFocused(false);
  };

//   useEffect(() => {
//   if (setPinReady) {
//     setPinReady(code.length === maxLength);
//     return () => setPinReady(false);
//   }
// }, [code]);

  const toCodeDigitInput = (_value: number, index: number) => {
    const emptyInputChar = '';
    const digit = code[index] || emptyInputChar;

    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;
    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    return (
      <View
        key={index}
        style={
          inputContainerIsFocused && isDigitFocused
            ? styles.codeInputFocused
            : styles.codeInput
        }
      >
        <Text style={styles.text}>{digit}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.codeInputContainer}
        onPress={handleOnPress}
        activeOpacity={1}
      >
        {codeDigitsArray.map(toCodeDigitInput)}
      </TouchableOpacity>

      <TextInput
        ref={textInputRef}
        value={code}
        onChangeText={setCode}
        onBlur={handleOnBlur}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        maxLength={maxLength}
        style={styles.hiddenInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  codeInput: {
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    minWidth: 45,
    alignItems: "center",
  },
  codeInputFocused: {
    borderColor: "#DD5E89",
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    minWidth: 45,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
});
