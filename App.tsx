import { StatusBar } from 'expo-status-bar';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useState, useCallback, useEffect} from "react";
import {
    AUTHOR,
    EMAIL,
    PHONE
} from "./src/const";
import {Launch, getLaunches} from "./src/launch";

function toLocalDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleString();
}

function renderCrew(crew: string[]): string {
    return crew.length === 0 ? "No crew" : crew.join();
}

function renderLaunch(item: Launch|null): string {
  if (item === null) {
    return "";
  }
  return "Rocket id:" + item.rocketId + "\n" +
    "Rocket name: " + item.rocketName + "\n" +
    "Mission details: " + (item.details ? item.details : "") + "\n" +
    toLocalDate(item.launchDate) + "\n" +
    "Crew: " + renderCrew(item.crew) + "\n" +
    "Rocket status: " + item.rocketStatus;
}

export default function App() {
    const [isLoading, setLoading] = useState(true);
    const [data: Launch[], setData] = useState([]);
    let [modalItem, setModalItem] = useState(null);
    const fetchData = useCallback(async () => {
        const launches = await getLaunches();
        setData(launches);
        setLoading(false);
    }, []);
    useEffect(() => {
        fetchData()
            .catch(console.error);
    }, []);
    
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text>Upcoming SpaceX launches</Text>
          </View>
          <View style={styles.main}>
            
          {isLoading ? <Text>Loading...</Text> :
          (
          <View style={styles.mainTable}>
            <Text style={{ fontSize: 18, color: 'green', textAlign: 'center'}}>Upcoming Launches</Text>
            <FlatList
              data={data}
              keyExtractor={({ id }, index) => id}
              renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => setModalItem(item)}>
                  <Text style={styles.cell}>{
                    "Rocket id:" + item.rocketId + "\n" +
                    "Rocket name: " + item.rocketName + "\n" +
                    item.flightNumber + "\n" +
                    toLocalDate(item.launchDate) + "\n" +
                    "Crew: " + renderCrew(item.crew)}
                  </Text>
                  </TouchableOpacity>
              )}
            />
          </View>
        )}
        </View>
      </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalItem !== null}
            onRequestClose={() => {
              setModalItem(null);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{renderLaunch(modalItem)}
                </Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalItem(null)}>
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>
              </View>
            </View>
          </Modal>
      <View style={styles.footer}>
        <Text>About me {AUTHOR}</Text>
        <Text>Email: {EMAIL}</Text>
        <Text>Phone: {PHONE}</Text>
      </View>
    </View>
    );
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    contentContainer: {
        flex: 1 
    },
    header: {
        padding: 20,
        height: 60,
    },
    cell: {
        padding: 5,
        borderColor: 'black',
        borderWidth: StyleSheet.hairlineWidth,
    },
    main: {
        flex: 1,
        padding: 24,
    },
    mainTable: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    footer: {
        height: 60,
        borderTopColor: 'black',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'left',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
