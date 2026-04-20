// ── CONSTITUTION ──

const CONST_SECTIONS = ['cst-name', 'cst-vision', 'cst-services', 'cst-attire', 'cst-bereavement', 'cst-conduct', 'cst-membership'];

// ── CONTENT DATA ──
const constData = {

  // ── ENGLISH ──
  en: `
    <div class="cst-section" id="cst-name-en">
      <div class="cst-eyebrow">Section 1</div>
      <h2>Church Name</h2>
      <div class="cst-badge">&#9632; Anointed in Living Christ (AILC)</div>
      <div class="cst-cards">
        <div class="cst-card"><div class="cst-card-label">Full Name</div><div class="cst-card-value">Anointed in Living Christ</div></div>
        <div class="cst-card"><div class="cst-card-label">Abbreviation</div><div class="cst-card-value">AILC</div></div>
        <div class="cst-card"><div class="cst-card-label">Registration No.</div><div class="cst-card-value">NRIC/20100816/1031/10</div></div>
        <div class="cst-card"><div class="cst-card-label">Arch Bishop</div><div class="cst-card-value">E.Z Mnisi</div></div>
      </div>
    </div>

    <div class="cst-section" id="cst-vision-en">
      <div class="cst-eyebrow">Section 2</div>
      <h2>Vision & Purpose</h2>
      <ul class="cst-list">
        <li>To worship Jehovah freely and in spirit</li>
        <li>To preach the gospel in all places and to encourage the Christian faith</li>
        <li>To work together with other churches in spreading the gospel</li>
        <li>To restore moral character and values in people</li>
        <li>To fight against poverty and hunger</li>
        <li>To encourage the church in Bible studies and in the development of people's lives</li>
        <li>To visit hospitals, prisons, orphans, the disabled, and the elderly</li>
      </ul>
    </div>

    <div class="cst-section" id="cst-services-en">
      <div class="cst-eyebrow">Section 3</div>
      <h2>Church Services</h2>
      <ul class="cst-list">
        <li>Wedding service</li>
        <li>Funeral service</li>
        <li>Holy Communion (Lord's Supper)</li>
        <li>Child dedication / blessing service</li>
        <li>Homecoming service after bereavement</li>
        <li>Conference services (Women's, Youth, and Full Church)</li>
        <li>Synod service</li>
      </ul>
    </div>

    <div class="cst-section" id="cst-attire-en">
      <div class="cst-eyebrow">Section 4</div>
      <h2>Church Attire</h2>
      <div class="cst-attire-grid">
        <div class="cst-attire-col">
          <h4>Men (Abesilisa)</h4>
          <ul class="cst-list">
            <li>Olive green shirt</li>
            <li>White trousers</li>
            <li>Jacket with belt (white/green)</li>
            <li>Deacon's jacket (for fathers)</li>
          </ul>
        </div>
        <div class="cst-attire-col">
          <h4>Women (Abesifazane)</h4>
          <ul class="cst-list">
            <li>Olive green shirt</li>
            <li>Long dress / skirt with belt (white/green)</li>
            <li>Deaconess jacket (for mothers)</li>
            <li>Headscarf / doek (white/green)</li>
          </ul>
        </div>
      </div>
      <p class="cst-colour-label">When to wear each colour</p>
      <div class="cst-cards">
        <div class="cst-card" style="border-top:3px solid #2a5c44">
          <div class="cst-card-label">Green Uniform — worn when</div>
          <div style="font-size:0.85rem;line-height:1.9;color:var(--ink-soft);margin-top:8px">Every Sunday<br>Invited events and functions<br>Funeral services (non-members)<br>Saturday service on Good Friday</div>
        </div>
        <div class="cst-card" style="border-top:3px solid var(--gold)">
          <div class="cst-card-label">White Uniform — worn when</div>
          <div style="font-size:0.85rem;line-height:1.9;color:var(--ink-soft);margin-top:8px">Friday service on Good Friday<br>Wedding service<br>Funeral service of a church member<br>Child blessing & First Sunday of the month</div>
        </div>
      </div>
    </div>

    <div class="cst-section" id="cst-bereavement-en">
      <div class="cst-eyebrow">Section 5</div>
      <h2>Bereavement Fund</h2>
      <div class="cst-warning">⚠️ This policy applies to the <strong>Gauteng Region only.</strong></div>
      <p style="font-size:0.9rem;line-height:1.9;color:var(--ink-soft);margin-bottom:20px">As a church we are committed to supporting our members in times of bereavement. The following relationships qualify:</p>
      <table class="cst-table">
        <thead><tr><th>Relationship</th><th>Payout Amount</th></tr></thead>
        <tbody>
          <tr><td>Church Member</td><td class="cst-amount">Up to R10 000</td></tr>
          <tr><td>Spouse (Wife / Husband)</td><td class="cst-amount">R2 000</td></tr>
          <tr><td>Parent (Father / Mother)</td><td class="cst-amount">R2 000</td></tr>
          <tr><td>Sibling (Sister / Brother)</td><td>—</td></tr>
          <tr><td>Child</td><td class="cst-amount">R2 000</td></tr>
          <tr><td>Dependent / Guardian</td><td>—</td></tr>
        </tbody>
      </table>
      <div class="cst-highlight"><strong>Member contribution per bereavement:</strong><br>R100 per member &nbsp;|&nbsp; R50 for other bereavements when the fund is low</div>
    </div>

    <div class="cst-section" id="cst-conduct-en">
      <div class="cst-eyebrow">Section 6</div>
      <h2>Member Conduct</h2>
      <ul class="cst-list">
        <li>Members must follow, respect, and adhere to the church's policies and procedures</li>
        <li>No one is permitted to discriminate based on colour, race, or any other form of harassment</li>
        <li>No one is permitted to use their power or position to coerce other members for personal gain</li>
        <li>Members must conduct themselves in a manner that demonstrates respect and brings dignity</li>
        <li>No one is permitted to act contrary to the church's values for personal satisfaction</li>
      </ul>
    </div>

    <div class="cst-section" id="cst-membership-en">
      <div class="cst-eyebrow">Section 7</div>
      <h2>Membership</h2>
      <ul class="cst-list">
        <li>All members are bound by the church's constitution, policies, and vision</li>
        <li>Members who do not abide by church policies will be suspended</li>
      </ul>
      <div class="cst-warning">⚠️ <strong>Important:</strong> If a member fails to attend church for <strong>three consecutive months</strong> without a valid reason, they must be <strong>re-admitted</strong> to the church.</div>
    </div>
  `,

  // ── ISIZULU ──
  zu: `
    <div class="cst-section" id="cst-name-zu">
      <div class="cst-eyebrow">Isahluko 1</div>
      <h2>Igama Lebandla</h2>
      <div class="cst-badge">&#9632; Anointed in Living Christ (AILC)</div>
      <div class="cst-cards">
        <div class="cst-card"><div class="cst-card-label">Igama Eligcwele</div><div class="cst-card-value">Anointed in Living Christ</div></div>
        <div class="cst-card"><div class="cst-card-label">Esikhudlwini</div><div class="cst-card-value">AILC</div></div>
        <div class="cst-card"><div class="cst-card-label">Inombolo Yokubhaliswa</div><div class="cst-card-value">NRIC/20100816/1031/10</div></div>
        <div class="cst-card"><div class="cst-card-label">Arch Bishop</div><div class="cst-card-value">E.Z Mnisi</div></div>
      </div>
    </div>

    <div class="cst-section" id="cst-vision-zu">
      <div class="cst-eyebrow">Isahluko 2</div>
      <h2>Injongo Yebandla</h2>
      <ul class="cst-list">
        <li>Ukukhonza uJehova ngokukhululeka</li>
        <li>Ukushumayela ivangeli kuzo zonke izindawo kanye nokukhuthaza inkolo yobukrestu</li>
        <li>Ukusebenza ngokuhlanganyela namanye amabandla ekushumayeleni ivangeli</li>
        <li>Ukuvuselela isimilo kubantu</li>
        <li>Ukulwa nobuphunya nendlala</li>
        <li>Ukukhuthaza ibandla ezifundweni zebhayibheli kanye nezokuthuthukisa izimpilo zabantu</li>
        <li>Ukuhambela ezibhedlela, emajele, izintandane, abakhubazekile kanye nabakhulile</li>
      </ul>
    </div>

    <div class="cst-section" id="cst-services-zu">
      <div class="cst-eyebrow">Isahluko 3</div>
      <h2>Izinkonzo Ebandleni</h2>
      <ul class="cst-list">
        <li>Inkonzo yomshado</li>
        <li>Inkonzo yomncwabo</li>
        <li>Inkonzo yesidlo senkosi</li>
        <li>Inkonzo yokubusisa abantwana</li>
        <li>Inkonzo yokubuyisa umzalwane ngemva yokushonelwa</li>
        <li>Inkonzo ye-conference (yomama, yentsha kanye nebbandla lonke)</li>
        <li>Inkonzo ye-Synod</li>
      </ul>
    </div>

    <div class="cst-section" id="cst-attire-zu">
      <div class="cst-eyebrow">Isahluko 4</div>
      <h2>Izambatho Zebandla</h2>
      <div class="cst-attire-grid">
        <div class="cst-attire-col">
          <h4>Abesilisa</h4>
          <ul class="cst-list">
            <li>Ihembe eli Olive green</li>
            <li>Ibhuluko elimhlophe</li>
            <li>Ijazi ne bhande (white/green)</li>
            <li>Ijazi lesiphika (Obaba)</li>
          </ul>
        </div>
        <div class="cst-attire-col">
          <h4>Abesifazane</h4>
          <ul class="cst-list">
            <li>Ihembe eli Olive green</li>
            <li>Idress elide / isiketi ne bhande (white/green)</li>
            <li>Ijazi lesiphika (Omama)</li>
            <li>Iduku (white/green)</li>
          </ul>
        </div>
      </div>
      <p class="cst-colour-label">Zigqokwa Nini Lezambatho</p>
      <div class="cst-cards">
        <div class="cst-card" style="border-top:3px solid #2a5c44">
          <div class="cst-card-label">Eziluhlaza — Green</div>
          <div style="font-size:0.85rem;line-height:1.9;color:var(--ink-soft);margin-top:8px">Njalo ngamasonto<br>Imisebenzi lapho simenywe khona<br>Imisebenxi yemingwabo ngaphandle kwamalunga ebandla<br>Inkonzo yangomgqibelo ngo GoodFriday</div>
        </div>
        <div class="cst-card" style="border-top:3px solid var(--gold)">
          <div class="cst-card-label">Ezimhlophe — White</div>
          <div style="font-size:0.85rem;line-height:1.9;color:var(--ink-soft);margin-top:8px">Inkonzo yangolwesiHlanu ngo GoodFriday<br>Inkonzo yomshado<br>Inkonzo yomncwabo welunga<br>Inkonzo yokubusisa abantwana kanye ne first Sunday</div>
        </div>
      </div>
    </div>

    <div class="cst-section" id="cst-bereavement-zu">
      <div class="cst-eyebrow">Isahluko 5</div>
      <h2>Izifo Ebandleni</h2>
      <div class="cst-warning">⚠️ Imali yezifo iqhubeka kuphela <strong>KuGauteng Region.</strong></div>
      <p style="font-size:0.9rem;line-height:1.9;color:var(--ink-soft);margin-bottom:20px">Lapho sibopheleke khona siyibandla uma kuvele isifo:</p>
      <table class="cst-table">
        <thead><tr><th>Ubudlelwano</th><th>Imali</th></tr></thead>
        <tbody>
          <tr><td>Ilunga lebandla</td><td class="cst-amount">Kuya ku-R10 000</td></tr>
          <tr><td>Inkosikazi / Umyeni</td><td class="cst-amount">R2 000</td></tr>
          <tr><td>Baba / Mama</td><td class="cst-amount">R2 000</td></tr>
          <tr><td>Sisi / Bhut</td><td>—</td></tr>
          <tr><td>Umtwana</td><td class="cst-amount">R2 000</td></tr>
          <tr><td>Ophila ngaphansi kwakhe (Guardian)</td><td>—</td></tr>
        </tbody>
      </table>
      <div class="cst-highlight"><strong>Iminikelo:</strong> R100 ilunga &nbsp;|&nbsp; R50 ezinye izifo uma isikwama sesingenamali noma incane</div>
    </div>

    <div class="cst-section" id="cst-conduct-zu">
      <div class="cst-eyebrow">Isahluko 6</div>
      <h2>Ukuziphatha Kwamalunga Ebandleni</h2>
      <ul class="cst-list">
        <li>Amalunga ebandla kufanele alandele, ayihloniphe futhi enze inchubo mgomo yebandla</li>
        <li>Akekho ovumeleke ukuhlukumeza ngokwebala, ngokweluhlanga noma enye indlela ehlukumezayo</li>
        <li>Akekho ovumeleke ukusebenzisa amandla/isikhundla ukucindezela amanye amalunga ebandla ukufeza/ukunelisa izidingo zakhe</li>
        <li>Amalunga kumele aziphathe ngendlela ebonakalisa inhlonipho futhi eletha isithunzi (dignity)</li>
        <li>Akekho ovumeleke ukwenza izinto ezingahambisani nebandla ukunelisa izidingo zakhe</li>
      </ul>
    </div>

    <div class="cst-section" id="cst-membership-zu">
      <div class="cst-eyebrow">Isahluko 7</div>
      <h2>Ubulunga Ebandleni</h2>
      <ul class="cst-list">
        <li>Onke amalunga ebandla aphoxelelekile emthethweni, enchubeni nasenjongweni yebandla</li>
        <li>Uma umzalwane angahambisi ngenqubomgomo webandla, uzawuncunywa ebandleni</li>
      </ul>
      <div class="cst-warning">⚠️ <strong>Kubalulekile:</strong> Uma ilunga lihluleka ukuza ebandleni izinyanga ezintathu ngaphandle kwesizathu esicinile, <strong>lamukelwa kabusha ebandleni.</strong></div>
    </div>
  `,

  // ── BOTH ──
  both: `
    <div class="cst-section" id="cst-name-both">
      <div class="cst-eyebrow">Section 1 · Isahluko 1</div>
      <h2>Church Name / <em style="font-weight:300">Igama Lebandla</em></h2>
      <div class="cst-badge">&#9632; Anointed in Living Christ (AILC)</div>
      <div class="cst-cards">
        <div class="cst-card"><div class="cst-card-label">Full Name / Igama Eligcwele</div><div class="cst-card-value">Anointed in Living Christ</div></div>
        <div class="cst-card"><div class="cst-card-label">Short / Esikhudlwini</div><div class="cst-card-value">AILC</div></div>
        <div class="cst-card"><div class="cst-card-label">Reg No.</div><div class="cst-card-value">NRIC/20100816/1031/10</div></div>
        <div class="cst-card"><div class="cst-card-label">Arch Bishop</div><div class="cst-card-value">E.Z Mnisi</div></div>
      </div>
    </div>

    <div class="cst-section" id="cst-vision-both">
      <div class="cst-eyebrow">Section 2 · Isahluko 2</div>
      <h2>Vision & Purpose / <em style="font-weight:300">Injongo Yebandla</em></h2>
      <table class="cst-table">
        <thead><tr><th>English</th><th>isiZulu</th></tr></thead>
        <tbody>
          <tr><td>To worship Jehovah freely and in spirit</td><td>Ukukhonza uJehova ngokukhululeka</td></tr>
          <tr><td>To preach the gospel in all places and encourage the Christian faith</td><td>Ukushumayela ivangeli kuzo zonke izindawo kanye nokukhuthaza inkolo yobukrestu</td></tr>
          <tr><td>To work together with other churches in spreading the gospel</td><td>Ukusebenza ngokuhlanganyela namanye amabandla ekushumayeleni ivangeli</td></tr>
          <tr><td>To restore moral character and values in people</td><td>Ukuvuselela isimilo kubantu</td></tr>
          <tr><td>To fight against poverty and hunger</td><td>Ukulwa nobuphunya nendlala</td></tr>
          <tr><td>To encourage Bible studies and development of people's lives</td><td>Ukukhuthaza ibandla ezifundweni zebhayibheli kanye nezokuthuthukisa izimpilo zabantu</td></tr>
          <tr><td>To visit hospitals, prisons, orphans, the disabled and elderly</td><td>Ukuhambela ezibhedlela, emajele, izintandane, abakhubazekile kanye nabakhulile</td></tr>
        </tbody>
      </table>
    </div>

    <div class="cst-section" id="cst-services-both">
      <div class="cst-eyebrow">Section 3 · Isahluko 3</div>
      <h2>Church Services / <em style="font-weight:300">Izinkonzo Ebandleni</em></h2>
      <table class="cst-table">
        <thead><tr><th>English</th><th>isiZulu</th></tr></thead>
        <tbody>
          <tr><td>Wedding service</td><td>Inkonzo yomshado</td></tr>
          <tr><td>Funeral service</td><td>Inkonzo yomncwabo</td></tr>
          <tr><td>Holy Communion (Lord's Supper)</td><td>Inkonzo yesidlo senkosi</td></tr>
          <tr><td>Child dedication / blessing service</td><td>Inkonzo yokubusisa abantwana</td></tr>
          <tr><td>Homecoming service after bereavement</td><td>Inkonzo yokubuyisa umzalwane ngemva yokushonelwa</td></tr>
          <tr><td>Conference services (Women's, Youth, Full Church)</td><td>Inkonzo ye-conference (yomama, yentsha kanye nebbandla lonke)</td></tr>
          <tr><td>Synod service</td><td>Inkonzo ye-Synod</td></tr>
        </tbody>
      </table>
    </div>

    <div class="cst-section" id="cst-attire-both">
      <div class="cst-eyebrow">Section 4 · Isahluko 4</div>
      <h2>Church Attire / <em style="font-weight:300">Izambatho Zebandla</em></h2>
      <table class="cst-table">
        <thead><tr><th>English</th><th>isiZulu</th></tr></thead>
        <tbody>
          <tr><td colspan="2" style="background:var(--warm);font-weight:600;font-size:0.78rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest)">Men / Abesilisa</td></tr>
          <tr><td>Olive green shirt</td><td>Ihembe eli Olive green</td></tr>
          <tr><td>White trousers</td><td>Ibhuluko elimhlophe</td></tr>
          <tr><td>Jacket with belt (white/green)</td><td>Ijazi ne bhande (white/green)</td></tr>
          <tr><td>Deacon's jacket (Fathers)</td><td>Ijazi lesiphika (Obaba)</td></tr>
          <tr><td colspan="2" style="background:var(--warm);font-weight:600;font-size:0.78rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest)">Women / Abesifazane</td></tr>
          <tr><td>Olive green shirt</td><td>Ihembe eli Olive green</td></tr>
          <tr><td>Long dress / skirt with belt (white/green)</td><td>Idress elide / isiketi ne bhande (white/green)</td></tr>
          <tr><td>Deaconess jacket (Mothers)</td><td>Ijazi lesiphika (Omama)</td></tr>
          <tr><td>Headscarf / Doek (white/green)</td><td>Iduku (white/green)</td></tr>
          <tr><td colspan="2" style="background:var(--warm);font-weight:600;font-size:0.78rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest)">Green — worn when / Eziluhlaza</td></tr>
          <tr><td>Every Sunday</td><td>Njalo ngamasonto</td></tr>
          <tr><td>Invited events and functions</td><td>Imisebenzi lapho simenywe khona</td></tr>
          <tr><td>Funeral services (non-members)</td><td>Imisebenxi yemingwabo ngaphandle kwamalunga ebandla</td></tr>
          <tr><td>Saturday service on Good Friday</td><td>Inkonzo yangomgqibelo ngo GoodFriday</td></tr>
          <tr><td colspan="2" style="background:var(--warm);font-weight:600;font-size:0.78rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest)">White — worn when / Ezimhlophe</td></tr>
          <tr><td>Friday service on Good Friday</td><td>Inkonzo yangolwesiHlanu ngo GoodFriday</td></tr>
          <tr><td>Wedding service</td><td>Inkonzo yomshado</td></tr>
          <tr><td>Funeral service of a church member</td><td>Inkonzo yomncwabo welunga</td></tr>
          <tr><td>Child blessing & First Sunday</td><td>Inkonzo yokubusisa abantwana kanye ne first Sunday</td></tr>
        </tbody>
      </table>
    </div>

    <div class="cst-section" id="cst-bereavement-both">
      <div class="cst-eyebrow">Section 5 · Isahluko 5</div>
      <h2>Bereavement Fund / <em style="font-weight:300">Izifo Ebandleni</em></h2>
      <div class="cst-warning">⚠️ Gauteng Region only / KuGauteng Region kuphela</div>
      <table class="cst-table">
        <thead><tr><th>English</th><th>isiZulu</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>Church Member</td><td>Ilunga lebandla</td><td class="cst-amount">Up to R10 000</td></tr>
          <tr><td>Spouse</td><td>Inkosikazi / Umyeni</td><td class="cst-amount">R2 000</td></tr>
          <tr><td>Parent</td><td>Baba / Mama</td><td class="cst-amount">R2 000</td></tr>
          <tr><td>Sibling</td><td>Sisi / Bhut</td><td>—</td></tr>
          <tr><td>Child</td><td>Umtwana</td><td class="cst-amount">R2 000</td></tr>
          <tr><td>Dependent / Guardian</td><td>Ophila ngaphansi kwakhe</td><td>—</td></tr>
        </tbody>
      </table>
      <div class="cst-highlight"><strong>Contribution / Iminikelo:</strong><br>R100 per member / ilunga &nbsp;|&nbsp; R50 when fund is low / uma isikwama sesingenamali</div>
    </div>

    <div class="cst-section" id="cst-conduct-both">
      <div class="cst-eyebrow">Section 6 · Isahluko 6</div>
      <h2>Member Conduct / <em style="font-weight:300">Ukuziphatha Kwamalunga</em></h2>
      <table class="cst-table">
        <thead><tr><th>English</th><th>isiZulu</th></tr></thead>
        <tbody>
          <tr><td>Members must follow, respect, and adhere to church policies</td><td>Amalunga ebandla kufanele alandele, ayihloniphe futhi enze inchubo mgomo yebandla</td></tr>
          <tr><td>No discrimination based on colour, race, or any form of harassment</td><td>Akekho ovumeleke ukuhlukumeza ngokwebala, ngokweluhlanga noma enye indlela ehlukumezayo</td></tr>
          <tr><td>No one may use power or position to coerce other members</td><td>Akekho ovumeleke ukusebenzisa amandla/isikhundla ukucindezela amanye amalunga</td></tr>
          <tr><td>Members must conduct themselves with respect and dignity</td><td>Amalunga kumele aziphathe ngendlela ebonakalisa inhlonipho futhi eletha isithunzi</td></tr>
          <tr><td>No one may act contrary to the church's values for personal gain</td><td>Akekho ovumeleke ukwenza izinto ezingahambisani nebandla ukunelisa izidingo zakhe</td></tr>
        </tbody>
      </table>
    </div>

    <div class="cst-section" id="cst-membership-both">
      <div class="cst-eyebrow">Section 7 · Isahluko 7</div>
      <h2>Membership / <em style="font-weight:300">Ubulunga Ebandleni</em></h2>
      <table class="cst-table">
        <thead><tr><th>English</th><th>isiZulu</th></tr></thead>
        <tbody>
          <tr><td>All members are bound by the church's constitution, policies, and vision</td><td>Onke amalunga ebandla aphoxelelekile emthethweni, enchubeni nasenjongweni yebandla</td></tr>
          <tr><td>Members who do not abide by church policies will be suspended</td><td>Uma umzalwane angahambisi ngenqubomgomo webandla, uzawuncunywa ebandleni</td></tr>
          <tr><td>Absent for 3 months without reason → must be re-admitted</td><td>Uma ilunga lihluleka ukuza izinyanga ezintathu ngaphandle kwesizathu esicinile, lamukelwa kabusha ebandleni</td></tr>
        </tbody>
      </table>
    </div>
  `
};

// ── Render content on first load ──
function initConstitution() {
  ['en', 'zu', 'both'].forEach(lang => {
    const panel = document.getElementById('const-panel-' + lang);
    if (panel && !panel.dataset.loaded) {
      panel.innerHTML = constData[lang];
      panel.dataset.loaded = 'true';
    }
  });
}

// ── Language switcher ──
function constSwitchLang(lang) {
  initConstitution();
  ['en', 'zu', 'both'].forEach(l => {
    const panel = document.getElementById('const-panel-' + l);
    const btn   = document.getElementById('const-btn-' + l);
    if (panel) panel.style.display = l === lang ? 'block' : 'none';
    if (btn)   btn.classList.toggle('active-tab', l === lang);
  });
}

// ── Section scroll ──
function constScrollTo(id) {
  initConstitution();
  const activeLang = ['en', 'zu', 'both'].find(l => {
    const p = document.getElementById('const-panel-' + l);
    return p && p.style.display !== 'none';
  }) || 'en';

  const el = document.getElementById(id + '-' + activeLang);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.querySelectorAll('.const-nav-tab').forEach(b => b.classList.remove('c-active'));
  if (event && event.target) event.target.classList.add('c-active');
}
