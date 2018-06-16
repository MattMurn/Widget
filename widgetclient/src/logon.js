let logon = new Msgs.Logon();
logon.SendingTime = new Date();
logon.HeartBtInt = 30;
logon.EncryptMethod = 0;
logon.passphrase = '...';

let presign = [
    logon.SendingTime,
    logon.MsgType,
    session.outgoing_seq_num,
    session.sender_comp_id,
    session.target_comp_id,
    passphrase
].join('\x01');

logon.RawData = sign(presign, secret);

session.send(logon);

sign = (what, secret) => {
    let key = Buffer(secret, 'base64');
    let hmac = crypto.createHmac('sha256', key);
    return hmac.update(what).digest('base64');
}