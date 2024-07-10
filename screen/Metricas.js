import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from 'axios';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width -40 ; // Reduce aún más el ancho para mejor ajuste

const Metricas = () => {
    const [data, setData] = useState([]);
    const [interval, setInterval] = useState('hora'); // Default interval
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMetrics(interval);
    }, [interval]);

    const fetchMetrics = async (tipo) => {
        try {
            console.log(`Fetching metrics for interval: ${tipo}`);
            const response = await axios.get(`http://192.168.56.1:3000/api/metricas/${tipo}`, {
                params: {
                    inicio: '2024-01-01',
                    fin: '2024-12-31'
                }
            });
            console.log('Response data:', response.data);
            setData(response.data);
            const newLabels = response.data.map(item => item.intervalo);
            const newValues = response.data.map(item => item.total_ingresos);
            setLabels(newLabels);
            setValues(newValues);
        } catch (error) {
            console.error('Error fetching metrics:', error);
            setError('Error fetching metrics');
        }
    };

    const pieChartData = data.map((item, index) => ({
        name: item.intervalo,
        ingresos: item.total_ingresos,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    }));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => setInterval('hora')}>
                        <Text style={styles.buttonText}>Por Hora</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setInterval('dia')}>
                        <Text style={styles.buttonText}>Por Día</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setInterval('semana')}>
                        <Text style={styles.buttonText}>Por Semana</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setInterval('mes')}>
                        <Text style={styles.buttonText}>Por Mes</Text>
                    </TouchableOpacity>
                </View>
                {error && <Text style={styles.error}>{error}</Text>}
                {data.length > 0 && (
                    <>
                        <BarChart
                            data={{
                                labels,
                                datasets: [
                                    {
                                        data: values
                                    }
                                ]
                            }}
                            width={screenWidth}
                            height={220}
                            yAxisLabel=""
                            chartConfig={{
                                backgroundColor: '#1c313a',
                                backgroundGradientFrom: '#37474f',
                                backgroundGradientTo: '#607d8b',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: '#ff5722'
                                }
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginLeft: 30
                            }}
                        />
                        <PieChart
                            data={pieChartData}
                            width={screenWidth}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#1c313a',
                                backgroundGradientFrom: '#37474f',
                                backgroundGradientTo: '#607d8b',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: '#ff5722'
                                }
                            }}
                            accessor="ingresos"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginLeft: 30
                            }}
                        />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#354093',
        borderColor: '#354093',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 20
    }
});

export default Metricas;

