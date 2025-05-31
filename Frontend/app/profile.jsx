import React, { useState, useEffect } from "react";
import {
  View,
<<<<<<< HEAD
=======
  Text,
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
<<<<<<< HEAD
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";

const API_BASE_URL = "http://10.0.2.2:5001/api/v1/user";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const border = useThemeColor({}, "primary");
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const accent = useThemeColor({}, "secondary");
=======
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const API_BASE_URL = "http://10.0.2.2:5000/api/v1/user";
const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [visibilityModal, setVisibilityModal] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [visibility, setVisibility] = useState({
    email: true,
    mobileNo: true,
    country: true,
    state: true,
    city: true,
    gender: true,
    bio: true,
    userName: true,
  });
  const [originalVisibility, setOriginalVisibility] = useState({});

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const border = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const text = useThemeColor({}, "text");
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
  const surface = useThemeColor({}, "surface");

  useEffect(() => {
    fetchProfile();
<<<<<<< HEAD
=======
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
  }, []);

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem("token");
<<<<<<< HEAD
    if (!token) {
      Alert.alert("Error", "No token found. Please login again.");
      router.replace("/login");
      return;
    }

=======
    if (!token) return router.replace("/login");
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
<<<<<<< HEAD
      const data = await res.json();
      if (res.ok) {
        const user = data.data.user;
        setProfile(user);
        setEmail(user.email);
        setMobileNo(user.mobileNo);
        setPhoto(user.profilePhoto?.url);
        setAddress(user.address || {});
        
      } else {
        Alert.alert("Error", data.message || "Failed to load profile.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong.");
=======
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      if (data.status === "success") {
        const user = data.data.user;
        setProfile(user);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setMobileNo(user.mobileNo || "");
        setGender(user.gender || "");
        setBio(user.bio || "");
        setPhoto(user.profilePhoto?.url || null);
        setAddress(user.address || { city: "", state: "", country: "" });

        const sharedInfo = user.profileSettings?.sharedInfo || [];
        const newVisibility = {
          email: sharedInfo.includes("email"),
          mobileNo: sharedInfo.includes("mobileNo"),
          country: sharedInfo.includes("country"),
          state: sharedInfo.includes("state"),
          city: sharedInfo.includes("city"),
          gender: sharedInfo.includes("gender"),
          bio: sharedInfo.includes("bio"),
          userName: sharedInfo.includes("userName"),
        };
        setVisibility(newVisibility);
        setOriginalVisibility(newVisibility);
      } else {
        throw new Error(data.message || "Failed to fetch profile.");
      }
    } catch (e) {
      console.log("Fetch profile error:", e.message);
      Alert.alert("Error", "Failed to fetch profile: " + e.message);
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
<<<<<<< HEAD
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

=======
    console.log("pickImage triggered");
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
    if (cameraPerm.status !== "granted" || galleryPerm.status !== "granted") {
      Alert.alert("Permission Required", "Camera and gallery access required.");
      return;
    }
<<<<<<< HEAD

=======
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
    Alert.alert("Select Image Source", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });
          handleImageResult(result);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });
          handleImageResult(result);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleImageResult = async (result) => {
    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", {
        uri: selected.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });
<<<<<<< HEAD

=======
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
      try {
        const response = await fetch(`${API_BASE_URL}/profile-photo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
<<<<<<< HEAD

=======
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
        const data = await response.json();
        if (response.ok) {
          setPhoto(data.data.user.profilePhoto.url);
          Alert.alert("Success", "Photo updated!");
        } else {
          Alert.alert("Error", data.message || "Upload failed.");
        }
<<<<<<< HEAD
      } catch {
        Alert.alert("Error", "Upload failed.");
=======
      } catch (e) {
        Alert.alert("Error", "Upload failed: " + e.message);
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
      }
    }
  };

  const handleSave = async () => {
    if (!email || !mobileNo) {
<<<<<<< HEAD
      Alert.alert(
        "Validation Error",
        "Email and Mobile Number cannot be empty."
      );
      return;
    }

=======
      Alert.alert("Validation Error", "Email and Mobile Number are required.");
      return;
    }
    setSaving(true);
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
<<<<<<< HEAD
        body: JSON.stringify({ email, mobileNo, address }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Profile updated!");
        fetchProfile();
        console.log("Loaded Custom User ID:", user.userId);
      } else {
        Alert.alert("Error", data.message || "Update failed.");
      }
    } catch {
      Alert.alert("Error", "Update failed.");
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={accent} />
=======
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          mobileNo,
          bio,
          gender,
          address,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Profile Updated");
        setEditMode(false);
        fetchProfile();
      } else {
        Alert.alert("Error", data.message || "Failed to update profile.");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to update profile: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleVisibilitySave = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert(
        "Error",
        "Authentication token missing. Please log in again."
      );
      router.replace("/login");
      return;
    }

    try {
      const sharedInfo = Object.keys(visibility).filter(
        (key) => visibility[key]
      );
      const payload = { public: false, sharedInfo };
      console.log("Saving visibility with payload:", payload);

      const res = await fetch(`${API_BASE_URL}/profile-settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Visibility save response:", data);

      if (!res.ok) {
        let errorMessage = "Unknown error";
        try {
          errorMessage = data.message || `HTTP error ${res.status}`;
        } catch {
          const errorText = await res.text();
          errorMessage = `HTTP error ${res.status}: ${errorText}`;
        }
        console.log("Visibility save failed:", errorMessage);
        throw new Error(errorMessage);
      }

      if (data.status === "success") {
        const updatedSharedInfo =
          data.data?.user?.profileSettings?.sharedInfo || sharedInfo;
        setVisibility({
          email: updatedSharedInfo.includes("email"),
          mobileNo: updatedSharedInfo.includes("mobileNo"),
          country: updatedSharedInfo.includes("country"),
          state: updatedSharedInfo.includes("state"),
          city: updatedSharedInfo.includes("city"),
          gender: updatedSharedInfo.includes("gender"),
          bio: updatedSharedInfo.includes("bio"),
          userName: updatedSharedInfo.includes("userName"),
        });
        setOriginalVisibility({ ...visibility });
        Alert.alert("Success", "Visibility Updated");
        setVisibilityModal(false);
        fetchProfile();
      } else {
        throw new Error(data.message || "Unexpected response format");
      }
    } catch (e) {
      console.log("Visibility save error:", e.message);
      Alert.alert(
        "Error",
        "Failed to save visibility on server: " +
          e.message +
          "\nChanges applied locally."
      );
      setOriginalVisibility(visibility);
      setVisibilityModal(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          Alert.alert("Success", "Logged out");
          router.replace("/login");
        },
      },
    ]);
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSettingsPress = () => {
    setSettingsModalVisible(true);
  };

  const renderField = (label, value, editable, onChangeText) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: border, color: text, backgroundColor: surface },
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        accessibilityLabel={label}
        accessibilityRole="text"
      />
    </View>
  );

  const renderVisibilityField = (label, fieldKey) => (
    <View style={styles.visibilityField}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
      <TouchableOpacity
        onPress={() => toggleVisibility(fieldKey)}
        accessibilityLabel={`Toggle ${label} visibility`}
        accessibilityRole="button"
      >
        <MaterialIcons
          name={visibility[fieldKey] ? "visibility" : "visibility-off"}
          size={24}
          color={text}
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={text} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loading}>
        <Text style={[styles.label, { color: text }]}>
          Failed to load profile
        </Text>
        <TouchableOpacity
          onPress={fetchProfile}
          accessibilityLabel="Retry Loading Profile"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={[border, secondary]}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </LinearGradient>
        </TouchableOpacity>
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
      </View>
    );
  }

  return (
<<<<<<< HEAD
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: surface }]}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={
                photo && photo.startsWith("http")
                  ? { uri: photo }
                  : require("@/assets/images/placeholder2.jpg")
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
          <ThemedText type="link" style={styles.uploadText} onPress={pickImage}>
            Change Photo
          </ThemedText>

          {[
            { label: "Username", value: profile.userName, editable: false },
            { label: "Email", value: email, onChangeText: setEmail },
            {
              label: "Mobile Number",
              value: mobileNo,
              onChangeText: setMobileNo,
            },
            {
              label: "User ID",
              value: profile.userId || profile._id,
              editable: false,
            },

            {
              label: "Registered On",
              value: new Date(profile.createdDate).toLocaleDateString(),
              editable: false,
            },
          ].map((field, idx) => (
            <View key={idx}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                {field.label}
              </ThemedText>
              <TextInput
                style={[styles.input, { borderColor: border, color: text }]}
                value={field.value}
                onChangeText={field.onChangeText}
                editable={field.editable !== false}
              />
            </View>
          ))}

          <View style={styles.statusContainer}>
            {[
              {
                label: profile.isVerified ? "Verified" : "Unverified",
                active: profile.isVerified,
              },
              {
                label: profile.availability ? "Available" : "Unavailable",
                active: profile.availability,
              },
            ].map((item, index) => (
              <View
                key={index}
                style={[
                  styles.statusChip,
                  { backgroundColor: item.active ? "#D1FADF" : "#FEE4E2" },
                ]}
              >
                <MaterialIcons
                  name={item.active ? "check-circle" : "cancel"}
                  size={16}
                  color={item.active ? "#027A48" : "#B42318"}
                  style={styles.statusIcon}
                />
                <ThemedText
                  style={[
                    styles.statusText,
                    { color: item.active ? "#027A48" : "#B42318" },
                  ]}
                >
                  {item.label}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.addressGroup}>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>Country</ThemedText>
              <TextInput
                style={styles.input}
                value={address.country || ""}
                onChangeText={(text) =>
                  setAddress({ ...address, country: text })
                }
              />
            </View>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>State</ThemedText>
              <TextInput
                style={styles.input}
                value={address.state || ""}
                onChangeText={(text) => setAddress({ ...address, state: text })}
              />
            </View>
          </View>

          <View style={styles.addressGroup}>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>City</ThemedText>
              <TextInput
                style={styles.input}
                value={address.city || ""}
                onChangeText={(text) => setAddress({ ...address, city: text })}
              />
            </View>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>Postal Code</ThemedText>
              <TextInput
                style={styles.input}
                value={address.postalCode || ""}
                onChangeText={(text) =>
                  setAddress({ ...address, postalCode: text })
                }
              />
            </View>
          </View>

          <View style={styles.addressGroup}>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>Country Code</ThemedText>
              <TextInput
                style={styles.input}
                value={address.countryCode || ""}
                onChangeText={(text) =>
                  setAddress({ ...address, countryCode: text })
                }
              />
            </View>
          </View>

          <ThemedButton
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
          >
            <Image
              source={{ uri: photo }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
=======
    <LinearGradient
      colors={["#FFF0EB", "#FAD4C0", "#EBB7AD"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.settingsButton, { backgroundColor: `${text}20` }]}
              onPress={handleSettingsPress}
              accessibilityLabel="Open Settings"
              accessibilityRole="button"
            >
              <MaterialIcons name="settings" size={28} color={text} />
            </TouchableOpacity>
            <Animated.View
              style={[styles.profileSection, { opacity: fadeAnim }]}
            >
              <TouchableOpacity
                onPress={() => setPhotoModalVisible(true)}
                accessibilityLabel="View or change profile photo"
                accessibilityRole="button"
              >
                <Image
                  source={{ uri: photo || "https://via.placeholder.com/150" }}
                  style={[
                    styles.profileImage,
                    editMode && { borderColor: border, borderWidth: 2 },
                  ]}
                  accessibilityLabel="User's profile photo"
                />
              </TouchableOpacity>
              {editMode && (
                <TouchableOpacity
                  style={styles.editPhotoButton}
                  onPress={pickImage}
                  accessibilityLabel="Change Profile Photo"
                  accessibilityRole="button"
                >
                  <MaterialIcons name="edit" size={24} color={text} />
                </TouchableOpacity>
              )}
              <View style={styles.nameSection}>
                <Text
                  style={[styles.name, { color: text }]}
                  accessibilityLabel={`User's name: ${firstName} ${lastName}`}
                  accessibilityRole="text"
                >
                  {firstName} {lastName}
                </Text>
                <Text style={[styles.subtext, { color: text }]}>
                  {profile?.tripCount || "0"} Trips Completed
                </Text>
              </View>
            </Animated.View>
          </View>

          <View style={styles.infoContainer}>
            {renderField("First Name", firstName, editMode, setFirstName)}
            {renderField("Last Name", lastName, editMode, setLastName)}
            {renderField("Email", email, editMode, setEmail)}
            {renderField("Mobile Number", mobileNo, editMode, setMobileNo)}
            {renderField("Bio", bio, editMode, setBio)}
            {renderField("Gender", gender, editMode, setGender)}
            {renderField("City", address.city || "", editMode, (text) =>
              setAddress((prev) => ({ ...prev, city: text }))
            )}
            {renderField("State", address.state || "", editMode, (text) =>
              setAddress((prev) => ({ ...prev, state: text }))
            )}
            {renderField("Country", address.country || "", editMode, (text) =>
              setAddress((prev) => ({ ...prev, country: text }))
            )}
          </View>

          {editMode && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                accessibilityLabel="Save Profile"
                accessibilityRole="button"
              >
                <LinearGradient
                  colors={[border, secondary]}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={surface} />
                  ) : (
                    <Text style={styles.buttonText}>Save Profile</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEditMode(false);
                  fetchProfile();
                }}
                accessibilityLabel="Cancel Edit"
                accessibilityRole="button"
              >
                <LinearGradient
                  colors={["#ccc", "#aaa"]}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={photoModalVisible}
          onRequestClose={() => {
            setPhotoModalVisible(false);
            console.log("Photo modal closed");
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.photoModalView, { backgroundColor: surface }]}>
              <TouchableOpacity
                style={[styles.modalCloseButton, { zIndex: 1 }]}
                onPress={() => {
                  setPhotoModalVisible(false);
                  console.log("Close button pressed");
                }}
                accessibilityLabel="Close Photo Modal"
                accessibilityRole="button"
              >
                <MaterialIcons name="close" size={24} color={text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalChangeButton}
                onPress={pickImage}
                accessibilityLabel="Change Profile Photo"
                accessibilityRole="button"
              >
                <MaterialIcons name="edit" size={24} color={text} />
              </TouchableOpacity>
              <Image
                source={{ uri: photo || "https://via.placeholder.com/150" }}
                style={styles.largePhoto}
                accessibilityLabel="Enlarged profile photo"
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={settingsModalVisible}
          onRequestClose={() => setSettingsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={["#FFF0EB", "#FAD4C0", "#EBB7AD"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.modalView, { backgroundColor: surface }]}
            >
              <View style={styles.dragHandle} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSettingsModalVisible(false)}
                accessibilityLabel="Close Settings"
                accessibilityRole="button"
              >
                <MaterialIcons name="close" size={24} color={text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: text }]}>Settings</Text>
              <TouchableOpacity
                style={[styles.modalOption, { borderBottomColor: border }]}
                onPress={() => {
                  setEditMode(true);
                  setSettingsModalVisible(false);
                }}
                accessibilityLabel="Edit Profile"
                accessibilityRole="button"
                accessibilityHint="Opens profile editing mode"
              >
                <View style={styles.modalOptionRow}>
                  <MaterialIcons name="edit" size={24} color={text} />
                  <Text style={[styles.modalText, { color: text }]}>
                    Edit Profile
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalOption, { borderBottomColor: border }]}
                onPress={() => {
                  setVisibilityModal(true);
                  setSettingsModalVisible(false);
                }}
                accessibilityLabel="Profile Visibility"
                accessibilityRole="button"
                accessibilityHint="Adjust what profile information is visible to others"
              >
                <View style={styles.modalOptionRow}>
                  <MaterialIcons name="visibility" size={24} color={text} />
                  <Text style={[styles.modalText, { color: text }]}>
                    Profile Visibility
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalOption, { borderBottomColor: border }]}
                onPress={() => {
                  setSettingsModalVisible(false);
                  handleLogout();
                }}
                accessibilityLabel="Logout"
                accessibilityRole="button"
                accessibilityHint="Logs you out of the app"
              >
                <View style={styles.modalOptionRow}>
                  <MaterialIcons name="logout" size={24} color={text} />
                  <Text style={[styles.modalText, { color: text }]}>
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={visibilityModal}
          onRequestClose={() => setVisibilityModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalView, { backgroundColor: surface }]}>
              <Text style={[styles.modalTitle, { color: text }]}>
                Profile Visibility
              </Text>
              <ScrollView>
                <TouchableOpacity
                  style={styles.previewButton}
                  onPress={() => setPreviewVisible(true)}
                  accessibilityLabel="Preview Profile"
                  accessibilityRole="button"
                >
                  <MaterialIcons name="visibility" size={24} color={text} />
                  <Text style={[styles.previewText, { color: text }]}>
                    Preview
                  </Text>
                </TouchableOpacity>
                {renderVisibilityField("📧 Email", "email")}
                {renderVisibilityField("📱 Mobile Number", "mobileNo")}
                {renderVisibilityField("🌍 Country", "country")}
                {renderVisibilityField("🏙️ State", "state")}
                {renderVisibilityField("🏘️ City", "city")}
                {renderVisibilityField("🚻 Gender", "gender")}
                {renderVisibilityField("📝 Bio", "bio")}
                {renderVisibilityField("Username", "userName")}
              </ScrollView>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleVisibilitySave}
                  accessibilityLabel="Save Visibility Changes"
                  accessibilityRole="button"
                >
                  <LinearGradient
                    colors={[border, secondary]}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setVisibility(originalVisibility);
                    setVisibilityModal(false);
                  }}
                  accessibilityLabel="Cancel Visibility Changes"
                  accessibilityRole="button"
                >
                  <LinearGradient
                    colors={["#ccc", "#aaa"]}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={previewVisible}
          onRequestClose={() => setPreviewVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalView, { backgroundColor: surface }]}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPreviewVisible(false)}
                accessibilityLabel="Close Preview"
                accessibilityRole="button"
              >
                <MaterialIcons name="close" size={24} color={text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: text }]}>
                Profile Preview
              </Text>
              <ScrollView>
                <View style={styles.profileSection}>
                  <Image
                    source={{ uri: photo || "https://via.placeholder.com/150" }}
                    style={styles.profileImage}
                  />
                  <View style={styles.nameSection}>
                    <Text style={[styles.name, { color: text }]}>
                      {firstName} {lastName}
                    </Text>
                    <Text style={[styles.subtext, { color: text }]}>
                      {profile?.tripCount || "0"} Trips Completed
                    </Text>
                  </View>
                </View>
                <View style={styles.infoContainer}>
                  {visibility.userName && firstName && lastName ? (
                    <Text style={[styles.label, { color: text }]}>
                      Username: {firstName} {lastName}
                    </Text>
                  ) : null}
                  {visibility.email && email ? (
                    <Text style={[styles.label, { color: text }]}>
                      Email: {email}
                    </Text>
                  ) : null}
                  {visibility.mobileNo && mobileNo ? (
                    <Text style={[styles.label, { color: text }]}>
                      Mobile: {mobileNo}
                    </Text>
                  ) : null}
                  {visibility.bio && bio ? (
                    <Text style={[styles.label, { color: text }]}>
                      Bio: {bio}
                    </Text>
                  ) : null}
                  {visibility.gender && gender ? (
                    <Text style={[styles.label, { color: text }]}>
                      Gender: {gender}
                    </Text>
                  ) : null}
                  {visibility.city && address.city ? (
                    <Text style={[styles.label, { color: text }]}>
                      City: {address.city}
                    </Text>
                  ) : null}
                  {visibility.state && address.state ? (
                    <Text style={[styles.label, { color: text }]}>
                      State: {address.state}
                    </Text>
                  ) : null}
                  {visibility.country && address.country ? (
                    <Text style={[styles.label, { color: text }]}>
                      Country: {address.country}
                    </Text>
                  ) : null}
                  {!(
                    (visibility.userName && firstName && lastName) ||
                    (visibility.email && email) ||
                    (visibility.mobileNo && mobileNo) ||
                    (visibility.bio && bio) ||
                    (visibility.gender && gender) ||
                    (visibility.city && address.city) ||
                    (visibility.state && address.state) ||
                    (visibility.country && address.country)
                  ) && (
                    <Text style={[styles.label, { color: text }]}>
                      No visible profile information to display.
                    </Text>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </LinearGradient>
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  scrollContent: { flexGrow: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    textAlign: "center",
    fontFamily: "SpaceMono",
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: "#000",
  },
  saveBtn: {
    marginTop: 20,
    marginBottom: 30,
  },
  addressGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  addressBox: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusIcon: {
    marginRight: 6,
=======
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },
  settingsButton: {
    padding: 12,
    borderRadius: 20,
    marginRight: 15,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    borderWidth: 1,
    borderColor: "#EBB7AD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editPhotoButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "border" + 20,
  },
  nameSection: {
    marginLeft: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
    letterSpacing: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subtext: {
    fontSize: 16,
    fontFamily: "SpaceMono",
  },
  infoContainer: {
    alignItems: "center",
    marginRight: 10,
    marginBottom: 20,
  },
  fieldContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "SpaceMono",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "SpaceMono",
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }
      : {
          elevation: 4,
        }),
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoModalView: {
    position: "relative",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  largePhoto: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalChangeButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "border" + 20,
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "text" + 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "SpaceMono",
    marginLeft: 10,
  },
  modalOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
  visibilityField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewText: {
    marginLeft: 5,
    fontSize: 16,
    fontFamily: "SpaceMono",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    color: "#fff",
    justifyContent: "space-between",
    marginTop: 20,
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
  },
});
