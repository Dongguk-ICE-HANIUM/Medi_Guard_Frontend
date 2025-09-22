import { colors } from '@/constants';
import { useSaveAppointment } from '@/hooks/useAppointment';
import { formatAppointmentDisplay } from '@/utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const add = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);


  const saveAppointment = useSaveAppointment();

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if(date){
      setSelectedDate(date);
    }
  };

  const formatDateForApi = (date:Date) : string => {
    return date.toISOString();
  }

  const handleSaveAppointment = () => {
    const appointmentData = {
      scheduleTime : formatDateForApi(selectedDate),
    };
    saveAppointment.mutate(appointmentData,{
      onSuccess: () => {
        Alert.alert("진료가 등록되었습니다.")
        router.back();
      },
      onError: (error) => {
        Alert.alert("진료 등록에 실패했습니다.", (error as Error).message);
      }
    });
  }

  const showDateTimePicker = () => {
    setShowDatePicker(true);
  }

  return (
    <View style={styles.container} >
      <Text style={styles.title}>진료 일정 추가하기</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>진료 날짜 및 시간</Text>
          
          <TouchableOpacity onPress={showDateTimePicker} style={styles.dateInput}>
            <Text style={styles.dateText}>
              {formatAppointmentDisplay(selectedDate.toISOString())}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
      <DateTimePicker 
        value={selectedDate}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />  
    )}
        </View>
        <TouchableOpacity
          onPress={handleSaveAppointment}
          disabled={saveAppointment.isPending}
          style={[
            styles.submitButton,
            saveAppointment.isPending && styles.submitButtonDisabled
          ]}
        >
          {saveAppointment.isPending ? (
            <ActivityIndicator color={colors.PINK} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>진료 등록</Text>
          )}
        </TouchableOpacity>
        
    </View>
  
  )
}

export default add

const styles = StyleSheet.create({
 container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateInput: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
   submitButton: {
    backgroundColor: colors.PINK,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  submitButtonDisabled: {
    backgroundColor: colors.LIGHT_GRAY,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
})