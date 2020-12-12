/* istanbul ignore file */
import logo from '../assets/images/paperwallet/feel-logo-blue-on-white-rgb.png';
import usbStick from '../assets/images/paperwallet/usb-stick.png';
import printer from '../assets/images/paperwallet/print.png';
import fonts from './paperwalletFonts';

class Paperwallet {
  constructor(JSPDF, props) {
    this.doc = new JSPDF({
      orientation: 'p',
      unit: 'pt',
      format: [600, 900],
    });
    this.props = props;

    this.setupDoc();
  }

  setupDoc() {
    const { account } = this.props;
    let line = -1;
    this.passphrase = account.passphrase.split(/\s/)
      .reduce((acc, word, index) => {
        line += index % 6 === 0 ? 1 : 0;
        acc[line] = acc[line] ? `${acc[line]} ${word}` : word;
        return acc;
      }, []);

    this.textOptions = {
      align: 'left',
      baseline: 'top',
      charSpace: 0.05,
      lineHeightFactor: 1.57,
    };

    this.doc.addFileToVFS('gilroy-bold.ttf', fonts.GilroyBold)
      .addFont('gilroy-bold.ttf', 'gilroy', 'bold');
    this.doc.addFileToVFS('gilroy-medium.ttf', fonts.GilroyMedium)
      .addFont('gilroy-medium.ttf', 'gilroy', 'normal');
    this.doc.setTextColor('#303030').setFont('gilroy');
  }

  renderHeader() {
    const { t, passphraseName } = this.props;
    const textOptions = this.textOptions;
    const now = new Date();
    const date = [
      `0${now.getDate()}`.substr(-2),
      `0${now.getMonth() + 1}`.substr(-2),
      `${now.getFullYear()}`,
    ];

    this.doc.addImage(logo, 'PNG', 32, 72, 67, 26);

    this.doc.setFontStyle('bold').setFontSize(16)
      .text(t('{{passphraseName}} paper wallet', { passphraseName }), 135, 64, {
        ...textOptions,
        lineHeightFactor: 1.18,
      });
    this.doc.setFontStyle('normal').setFontSize(14)
      .text(t('Store this document in a safe place.'), 135, 84, textOptions);

    this.doc.setFontStyle('bold').setFontSize(16)
      .text(date.join('.'), 568, 75, {
        ...textOptions,
        align: 'right',
        lineHeightFactor: 1.18,
      });
    return this;
  }

  renderInstructions() {
    const { t } = this.props;
    const textOptions = this.textOptions;

    this.doc.addImage(printer, 'PNG', 32, 185, 36, 36);
    this.doc.addImage(usbStick, 'PNG', 32, 229, 36, 36);

    this.doc.setFontStyle('normal').setFontSize(14);
    this.doc.text(t('How we recommend to store it.'), 32, 147, textOptions);
    this.doc.text(t('Print it on paper and store it in a safe place'), 76, 194, textOptions);
    this.doc.text(t('Save it on an encrypted hard drive: USB key or a backup drive'), 76, 238, textOptions);
    return this;
  }

  renderAccount() {
    const { account, t } = this.props;
    const textOptions = this.textOptions;

    this.doc.setFontStyle('normal').setFontSize(14)
      .text(t('Wallet address:'), 32, 300, textOptions);
    this.doc.setFontStyle('bold').setFontSize(18)
      .text(account.address, 32, 340, {
        ...textOptions,
        lineHeightFactor: 2.22,
      });

    this.doc.setFontStyle('normal').setFontSize(14)
      .text(t('Passphrase:'), 32, 406, textOptions);
    this.doc.setFontStyle('bold').setFontSize(18)
      .text(this.passphrase, 32.5, 464, {
        ...textOptions,
        align: 'justify',
        lineHeightFactor: 2,
      });

    this.doc.setFillColor('#BEC1CD')
      .rect(32, 443.5, 530, 1, 'F')
      .rect(32, (464 + (this.passphrase.length * 40)), 530, 1, 'F');
    return this;
  }

  renderFooter() {
    const { qrcode, t } = this.props;
    const textOptions = this.textOptions;
    const marginTop = this.passphrase.length * 45;
    this.doc.setFontSize(14).setFontStyle('normal');
    this.doc.text(t('Access your account by scanning the QR code below with the Feel Mobile App:'), 32, 495 + marginTop, textOptions);
    this.doc.addImage(qrcode, 'PNG', 240, 564 + marginTop, 120, 120);
    return this;
  }

  save(walletName) {
    this.renderHeader()
      .renderInstructions()
      .renderAccount()
      .renderFooter()
      .doc.save(`${walletName}`);
  }
}

const renderPaperwallet = (JSPDF, data, walletName) => {
  const pdf = new Paperwallet(JSPDF, data);
  pdf.save(walletName);
};

export default renderPaperwallet;
