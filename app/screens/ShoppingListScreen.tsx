// app/screens/ShoppingListScreen.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useShoppingList } from '../contexts/ShoppingListContext';
import CustomText from '../components/CustomText';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';

const ShoppingListScreen: React.FC = () => {
  const { shoppingList, removeIngredient, clearList } = useShoppingList();
  const { t } = useTranslation();

  const confirmClear = () => {
    Alert.alert(
      t('clearAllIngredients'),
      t('areYouSureYouWantToClear'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          style: 'destructive',
          onPress: () => clearList(),
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText style={styles.title}>{t('ShoppingList')}</CustomText>
        {shoppingList.length > 0 && (
          <TouchableOpacity onPress={confirmClear}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
      {shoppingList.length === 0 ? (
        <CustomText style={styles.emptyText}>
          {t('noItemsInShoppingList')}
        </CustomText>
      ) : (
        <FlatList
          data={shoppingList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <CustomText style={styles.itemText}>
                {item.name} - {item.quantity}
              </CustomText>
              <TouchableOpacity onPress={() => removeIngredient(item.id)}>
                <Ionicons name="close-circle-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 18,
    fontSize: 18,
    flex: 1, // 남은 공간을 차지하도록
    flexWrap: 'wrap', // 줄바꿈 허용
    marginRight: 10,
  },
});

export default ShoppingListScreen;
