import React, { useRef, useEffect } from 'react';

export const OtpInput = ({
  value = '',
  onChange,
  length = 6,
  disabled = false,
  error = false,
}) => {
  const inputRefs = useRef([]);

  // Ensure digits array length matches expected length
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  // Auto-focus the first empty box or the first box on mount
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      const firstEmptyIndex = digits.findIndex((d) => !d);
      const targetIndex = firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex;
      inputRefs.current[targetIndex]?.focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const rawVal = e.target.value;
    // Extract only digits
    const cleanDigit = rawVal.replace(/[^0-9]/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    const combined = newDigits.join('').slice(0, length);
    onChange(combined);

    // Auto-advance to next box if digit was typed
    if (cleanDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move back and clear previous box
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-4" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          autoComplete="one-time-code"
          className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl bg-[#091426] text-white border-2 transition-all outline-none ${
            error
              ? 'border-[#EF4444] focus:border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : digits[index]
              ? 'border-[#E7B43F] text-[#E7B43F] shadow-[0_0_10px_rgba(231,180,63,0.2)]'
              : 'border-[#252D42] focus:border-[#00D9E8] focus:shadow-[0_0_12px_rgba(0,217,232,0.3)]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
