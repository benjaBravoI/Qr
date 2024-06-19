const confirmDeletion = (item) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`¿Estás seguro de eliminar a ${item.name}?`);
      if (confirmed) {
        deleteGuardia(item.rut);
      }
    } else {
      Alert.alert(
        'Eliminar guardia',
        `¿Estás seguro de eliminar a ${item.name}?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            onPress: () => deleteGuardia(item.rut),
          },
        ],
      );
    }
  };

  const deleteGuardia = (rut) => {
    axios.put(`http://localhost:3000/api/deleteguardias/${rut}`)
      .then(() => {
        console.log('Guardia eliminado con éxito:', rut); // Log de depuración
        fetchGuardias();
      })
      .catch(error => {
        console.error('Error al eliminar el guardia:', error);
      });
  };