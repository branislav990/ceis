document.addEventListener('DOMContentLoaded', () => {
    const blogpostDateEl = document.getElementById('blogpost-date');
    const blogPostDate = blogpostDateEl.getAttribute('datetime');

    const dayNum = blogPostDate.split('-')[0];
    const day = dayNum[0] === '0' ? dayNum.slice(1, dayNum.length) : dayNum;

    const monthNum = blogPostDate.split('-')[1];
    let month;
    switch (monthNum) {
        case '01':
            month = 'januara';
            break;
        case '02':
            month = 'februara';
            break;
        case '03':
            month = 'marta';
            break;
        case '04':
            month = 'aprila';
            break;
        case '05':
            month = 'maja';
            break;
        case '06':
            month = 'juna';
            break;
        case '07':
            month = 'jula';
            break;
        case '08':
            month = 'avgusta';
            break;
        case '09':
            month = 'septembra';
            break;
        case '10':
            month = 'oktobra';
            break;
        case '11':
            month = 'novembra';
            break
        case '12':
            month = 'decembra';
            break;
    }

    const yearNum = blogPostDate.split('-')[2];
    const year = `20${yearNum}`

    blogpostDateEl.textContent = `${day}. ${month} ${year}.`
});