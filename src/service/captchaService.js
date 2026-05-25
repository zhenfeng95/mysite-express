const svgCaptcha = require('svg-captcha');

function styleCaptchaSvg(svg) {
    return svg
        .replace(/<text([^>]*?)fill="[^"]*"([^>]*?)>/g, '<text$1fill="#4b6fdc"$2>')
        .replace(/<text(?![^>]*fill=)/g, '<text fill="#4b6fdc"')
        .replace(/<path([^>]*?)stroke="[^"]*"([^>]*?)>/g, '<path$1stroke="#c7d5ff"$2>')
        .replace(/<path(?![^>]*stroke=)/g, '<path stroke="#c7d5ff"')
        .replace(/<line([^>]*?)stroke="[^"]*"([^>]*?)>/g, '<line$1stroke="#c7d5ff"$2>')
        .replace(/<line(?![^>]*stroke=)/g, '<line stroke="#c7d5ff"');
}

module.exports.getCaptchaService = async function () {
    const captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: 'iIl10Oo',
        noise: 3,
        color: true
    });

    const svg = styleCaptchaSvg(captcha.data);
    const image = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

    return {
        text: captcha.text,
        image
    };
};
