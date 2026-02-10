import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (variant === 'primary') {
      baseStyle.push({ backgroundColor: disabled ? colors.disabled : colors.primary });
    } else if (variant === 'secondary') {
      baseStyle.push({ backgroundColor: disabled ? colors.disabled : colors.secondary });
    } else if (variant === 'outline') {
      baseStyle.push({ 
        backgroundColor: 'transparent', 
        borderWidth: 2, 
        borderColor: disabled ? colors.disabled : colors.primary 
      });
    }
    
    return [...baseStyle, style];
  };
  
  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    if (variant === 'outline') {
      baseStyle.push({ color: disabled ? colors.textSecondary : colors.primary });
    } else {
      baseStyle.push({ color: disabled ? colors.textSecondary : '#FFFFFF' });
    }
    
    return [...baseStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});