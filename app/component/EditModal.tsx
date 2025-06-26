import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  visible: boolean;
  field: "username" | "phone" | string; // cho phép mở rộng
  currentValue: string;
  onClose: () => void;
  onSave: (newValue: string) => void;
}

const ChangeFieldModal: React.FC<Props> = ({ visible, field, currentValue, onClose, onSave }) => {
  const [value, setValue] = useState(currentValue);

  useEffect(() => {
    setValue(currentValue); // reset khi mở modal
  }, [currentValue, visible]);

  const getTitle = () => {
    if (field === "username") return "Change Username";
    if (field === "phone") return "Change Phone";
    return "Edit Field";
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{getTitle()}</Text>

          <TextInput
            style={styles.input}
            placeholder={`Enter new ${field}`}
            placeholderTextColor="#666"
            value={value}
            onChangeText={setValue}
            keyboardType={field === "phone" ? "phone-pad" : "default"}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSave(value)}>
                <LinearGradient 
                    start={{x: 0, y: 0}} 
                    end={{x: 1, y: 0}} 
                    colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                    style={[styles.linearGradient1]}>

                    <Text style={styles.buttonText1}>
                        Save
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeFieldModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: "#999",
  },
  linearGradient1: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 60,
    },
buttonText1: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
},
});
