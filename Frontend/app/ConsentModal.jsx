import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { ThemedButton } from "@/components/ThemedButton";

export default function ConsentModal({ visible, onClose, consent, setConsent, onSubmit }) {
  const isComplete = consent.noTouch && consent.respectful && consent.safety;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Consent Form</Text>

          <ScrollView style={{ marginBottom: 16 }}>
            <View style={styles.row}>
              <Switch
                value={consent.noTouch}
                onValueChange={() =>
                  setConsent({ ...consent, noTouch: !consent.noTouch })
                }
              />
              <Text style={styles.label}>I agree to the no-touch rule</Text>
            </View>

            <View style={styles.row}>
              <Switch
                value={consent.respectful}
                onValueChange={() =>
                  setConsent({ ...consent, respectful: !consent.respectful })
                }
              />
              <Text style={styles.label}>I will be respectful</Text>
            </View>

            <View style={styles.row}>
              <Switch
                value={consent.safety}
                onValueChange={() =>
                  setConsent({ ...consent, safety: !consent.safety })
                }
              />
              <Text style={styles.label}>I understand the safety rules</Text>
            </View>
          </ScrollView>

          <ThemedButton
            title="Tap On"
            onPress={() => {
              if (isComplete) {
                onSubmit();
                onClose();
              }
            }}
            disabled={!isComplete}
          />

          <Pressable onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={{ color: "#aaa", textAlign: "center" }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    flexShrink: 1,
  },
});
