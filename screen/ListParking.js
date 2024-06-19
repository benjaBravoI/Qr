import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ListItem, Avatar, Button, Icon } from 'react-native-elements';

export default function ListGuard({ navigation }) {

    const list = [
        {
          name: 'Estacionamiento 1',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          subtitle: 'Estacionamineto 1'
        },
        {
          name: 'Estacionamiento 1',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
          subtitle: 'Estacionamiento 2'
        },
       
    
      ];

      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <FlatList

                keyExtractor={(item, index) => index.toString()}
                data={list}
                renderItem={({ item }) => (
                    <ListItem >
                        <Avatar source={{ uri: item.avatar_url }} />
                        <ListItem.Content>
                            <ListItem.Title>{item.name}</ListItem.Title>
                            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
                        </ListItem.Content>
                        <Button
                            onPress={()=> navigation.navigate("EditEstacionamiento")}
                            type="clear"
                            icon={<Icon name="edit" size={25} color="grey"/>}/>
                        
                        <Button
                            onPress={()=> confirmDeletion(user)}
                            type="clear"
                            icon={<Icon name="delete" size={25} color="grey"/>}/>

                    </ListItem>
                )}

            
            
            
            
            
            
            
            
            
            />





            </SafeAreaView>


   






            );


}
