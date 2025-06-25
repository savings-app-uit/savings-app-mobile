import { forgotPasswordSendCodeAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useState, useEffect } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ChangeFieldModal from '../component/EditModal';
import ChangePasswordModal from '../component/ChangePasswordModal';
import { getProfileAPI, updateProfileAPI } from '@/utils/api';

// Extend IProfile
export default function Profile() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [editingField, setEditingField] = useState<"username" | "phone" | "">("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(true);
    

    const user = {
      name: "Sanni",
      avatar: "https://i.pinimg.com/736x/52/aa/9a/52aa9a7dcf0b72fd435ce6cd526981a1.jpg",
      phone: "12345",
      email: "hihihaha@gmail.com"
    };

    const handleBack = () => {
        router.back();
    };

    const handleEdit = (field: "username" | "phone") => {
      setEditingField(field);
      setModalVisible(true);
    };
    return (
      <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}>

          <View style={{ flexGrow: 1, backgroundColor: '#fff'}}>

              <View style={{flexDirection: 'row', marginTop: 0}}>
                  <TouchableOpacity onPress={handleBack}>
                      <Ionicons
                          style={{ marginLeft: 20, marginTop: 50,}}
                          name={'arrow-back'}
                          size={30}
                          color="#999"/>
                  </TouchableOpacity>

                  <View style={{ flex: 1, alignItems: 'center', position: 'relative', marginLeft: -30 }}>
                      <MaskedView 
                          maskElement={
                              <Text style={styles.gradientLogo}>
                                  Zentra
                              </Text>
                          } 
                          style={{marginTop: 50, position: 'absolute'}}>
                          <LinearGradient 
                              colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                              start={{ x: 0, y: 0 }} 
                              end={{ x: 1, y: 0 }}
                              style={{ paddingHorizontal: 10 }}>

                              <Text style={[styles.gradientLogo, { opacity: 0 }]}>
                                  Zentra
                              </Text>
                          </LinearGradient>
                      </MaskedView>
                  </View> 
              </View> 
                    
              <View style={styles.content}>
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Image
                      source={{uri: user.avatar}}
                      style={{ width: 100, height: 100, borderRadius: 999 }}
                    />
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                      <Text style={styles.bold}>{user.name}</Text>
                      <TouchableOpacity onPress={() => handleEdit('username')}>
                        <Ionicons
                          name={'pencil-sharp'}
                          size={20}
                          color='#999'/>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16}}>
                    <View>
                      <Text style={styles.label}>
                          Email
                      </Text>
                      <Text style={styles.data}>
                        {user.email}
                      </Text>
                    </View>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16}}>
                    <View>
                      <Text style={styles.label}>
                          Phone
                      </Text>
                      <Text style={styles.data}>
                        {user.phone}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleEdit('phone')}>
                      <LinearGradient 
                          start={{x: 0, y: 0}} 
                          end={{x: 1, y: 0}} 
                          colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                          style={[styles.linearGradient1]}>

                          <Text style={styles.buttonText1}>
                              Edit
                          </Text>
                      </LinearGradient>
                  </TouchableOpacity>
                  <ChangeFieldModal
                    visible={modalVisible}
                    field={editingField}
                    currentValue={editingField === "username" ? username : phone}
                    onClose={() => setModalVisible(false)}
                    onSave={()=> null}
                  />
                  </View>
                  <ChangePasswordModal
                    visible={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    onSave={(currentPass, newPass) => {
                      // TODO: gọi API đổi mật khẩu
                      console.log("Current:", currentPass);
                      console.log("New:", newPass);
                      setShowPasswordModal(false);
                    }}
                  />
                  <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 16 }} />
                  <TouchableOpacity onPress={() => setShowPasswordModal(true)}>
                      <LinearGradient 
                          start={{x: 0, y: 0}} 
                          end={{x: 1, y: 0}} 
                          colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                          style={[styles.linearGradient, {marginTop: 20, alignSelf: 'center', width: '80%', height: 50}]}>

                          <Text style={styles.buttonText}>
                              Change your Password
                          </Text>
                      </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity>
                      <LinearGradient 
                          start={{x: 0, y: 0}} 
                          end={{x: 1, y: 0}} 
                          colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                          style={[styles.linearGradient, {marginTop: 20, alignSelf: 'center', width: '80%', height: 50}]}>

                          <Text style={styles.buttonText}>
                              Log out
                          </Text>
                      </LinearGradient>
                  </TouchableOpacity>
              </View>    
                          
              
          </View>
      </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      resizeMode: 'contain',
    },
    
    gradientLogo: {
      fontFamily: 'Inter',
      fontSize: 32,
      fontWeight: 'bold',
    },
    content: {
      marginTop: 20,
      padding: 30
    },
    bold: {
      fontFamily: 'Inter',
      fontWeight: 700,
      color: '#000',
      fontSize: 30
    },
    label: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: 16,
      color: '#6c7278'
    },
    data: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: 20,
      color: '#000'
    },
    linearGradient1: {
        flex: 1,
        borderRadius: 60,
        alignContent: 'center',
        marginVertical: 10
    },
    buttonText1: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 60
    },
    buttonText: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 15,
    },
});