// app/navigation/DrawerToggleButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DrawerToggleButtonProps {
  navigation: any;
}

const DrawerToggleButton: React.FC<DrawerToggleButtonProps> = ({
  navigation,
}) => {
  // 부모 네비게이터(드로어 네비게이터)를 가져옴
  const parentNav = navigation.getParent();
  return (
    <TouchableOpacity
      onPress={() => parentNav?.openDrawer()}
      style={{ marginLeft: 15 }}
    >
      <Ionicons name="menu" size={24} color="#007AFF" />
    </TouchableOpacity>
  );
};

export default DrawerToggleButton;
