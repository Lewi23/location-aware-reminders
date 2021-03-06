import { Audio } from 'expo-av';

export default async function playSound() {

    const { sound } = await Audio.Sound.createAsync(
       require('../assets/reminder_audio.mp3')
    );
    
    await sound.playAsync(); 
}

