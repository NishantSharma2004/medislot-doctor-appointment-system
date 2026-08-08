package com.medislot.common.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AesMedicalDataConverterTest {

    private AesMedicalDataConverter converter;

    @BeforeEach
    void setUp() {
        converter = new AesMedicalDataConverter();
    }

    @Test
    void convertToDatabaseColumn_shouldEncryptDataWithPrefix() {
        String plainText = "Patient suffers from acute arrhythmia. Prescribed Metoprolol 50mg.";
        String cipherText = converter.convertToDatabaseColumn(plainText);

        assertNotNull(cipherText);
        assertTrue(cipherText.startsWith("ENC::"));
        assertNotEquals(plainText, cipherText);
    }

    @Test
    void convertToEntityAttribute_shouldDecryptCipherTextToOriginalString() {
        String originalText = "Prescription: Amoxicillin 500mg TID for 7 days.";
        String cipherText = converter.convertToDatabaseColumn(originalText);

        String decryptedText = converter.convertToEntityAttribute(cipherText);
        assertEquals(originalText, decryptedText);
    }

    @Test
    void convertToEntityAttribute_shouldHandleUnencryptedLegacyText() {
        String legacyPlainText = "Unencrypted old medical notes";
        String decryptedText = converter.convertToEntityAttribute(legacyPlainText);

        assertEquals(legacyPlainText, decryptedText);
    }

    @Test
    void convertToDatabaseColumn_shouldHandleNullAndEmpty() {
        assertNull(converter.convertToDatabaseColumn(null));
        assertEquals("", converter.convertToDatabaseColumn(""));
    }
}
