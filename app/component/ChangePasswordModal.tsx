import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => void;
}

const ChangePasswordModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (!currentPassword) {
      Alert.alert("Error", "Current password is required.");
      return;
    }
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    onSave(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Change Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Current password"
            placeholderTextColor="#666"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="New password"
            placeholderTextColor="#666"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#666"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
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

export default ChangePasswordModal;

const styles = StyleSheet.create({
overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
},
modalContent: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: 10,
    padding: 20,
},
title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
},
input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
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
saveButton: {
    backgroundColor: "#D979F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
},
saveText: {
    color: "white",
    fontWeight: "bold",
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
