DROP EVENT IF EXISTS expire_old_refresh_token;
CREATE EVENT expire_old_refresh_token ON SCHEDULE EVERY 1 MINUTE DO 
BEGIN
    DELETE FROM refreshtokens WHERE refresh_token_expiration <= NOW();
    UPDATE refreshtokens SET old_refresh_token = NULL, old_refresh_token_expiration = NULL WHERE old_refresh_token_expiration <= NOW();
END;