<template>
    <div class='loginForm'>
        <!-- <nuxt-link to='/' class='logo'><h1>HitGall</h1></nuxt-link> -->
        <h5>회원가입</h5>
        <hr>
        <div v-if='step == 1'>
            <b-form>
                <b-form-group label='이용약관'>
                    <div class='termsBox'>제1조[목적]
본 약관은 '힛갤' 가 제공하는 서비스의 이용조건과 '힛갤' 운영에 관한 제반사항 규정을 목적으로 한다.

제2조[정의]
① 이 약관에서 사용하는 용어의 정의는 다음과 같다.
1. '회원' 이라 함은 '힛갤' 의 약관에 동의하고 개인정보를 제공하여 회원가입을 한 자로서, '힛갤' 와의 이용계약을 체결하고  '힛갤' 에서 제공하는 서비스를 이용하는 자.
2. '회원 아이디' (이하 'ID') 라 함은  '힛갤' 회원의 식별과 동 사이트 회원의 서비스 이용을 용이하게 하기 위하여 회원이 정하고  '힛갤' 가 승인하는 문자와 숫자의 조합.
3. '비밀번호' 이라 함은 '힛갤' 회원이 정한 ID와 일치된 회원임을 확인하고 회원의 권익보호를 위하여 회원이 선정한 문자와 숫자 및 특수문자의 조합.
4. '운영진' 이라 함은 '힛갤' 홈페이지를 개설하여 운영하는 운영진.
5. '게시물' 이라 함은 '힛갤'  회원이 '힛갤' 를 이용함에 있어 '힛갤' 에 게시한 부호ㆍ문자ㆍ음성ㆍ음향ㆍ동영상 등의 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등.
6. '댓글' 이라 함은 '힛갤' 회원이 '힛갤' 에 게시된 본인 혹은 타인의 게시글에 '댓글등록' 을 거쳐 게시한 글.
7. '탈퇴' 라 함은 '힛갤' 회원이 '힛갤' 와의 이용계약을 해지 및 해약.
② 단, 위 약관에서 '힛갤' 운영진 객관적 판단을 통해 용어의 정의를 추가할 수 있다.

제3조[약관외 준칙]
① '힛갤' 회원은 본 약관에 동의한 때부터 효력이 발생한다.
② '힛갤' 의 공지사항 게시판에 별도의 운영 공지를 게시할 수 있다. '힛갤' 운영진은 필요한 경우 별도로 운영정책을 공지 안내할 수 있으며, 본 약관과 운영정책이 중첩될 경우 운영정책이 우선 적용된다.
③ '힛갤' 운영진은 필요한 경우 별도로 운영정책을 공지 안내할 수 있으며, 본 약관과 운영정책이 중첩될 경우 운영정책이 우선 적용된다.
④ 합리적 사안일 경우 약관은 '힛갤' 운영진의 임의에 따라 변경될 수 있다.

제4조[이용계약 체결]
① 이용계약은 '힛갤' 회원으로 등록하여  '힛갤' 사이트를 이용하려는 자의 본 약관 내용에 대한 동의와 가입신청에 대하여  '힛갤' 운영진의 이용 승낙으로 체결된다.
② 이용계약 체결은  '힛갤' 회원으로 등록하여  '힛갤' 의 서비스를 이용하려는 자가  '힛갤' 가입신청시 본 약관을 읽고 아래에 있는 '동의합니다' 를 선택하는 것으로 본 약관에 대한 동의의 의사표시를 한 것이다.

제5조[회원가입]
① '힛갤' 회원으로 등록하여 본 사이트를 이용하려는 이용자는 사이트에서 요청하는 제반정보(이용자ID, 비밀번호, 닉네임 등)를 제공해야 한다.
② '힛갤' 와의 이용계약의 성립 시기는 '힛갤' 가 가입완료를 신청절차 상에 표시한 시점으로 한다.
③ '힛갤' 회원은 회원정보 기재 내용에 변경이 필요한 경우, 즉시 변경사항을 정정하여 기재해야 한다.
④ '힛갤' 는 제1항과 같이 '힛갤' 회원으로 가입할 것을 신청한 자가 다음 각 호에 해당할 경우, 회원가입을 거부하거나 자격을 상실하게 할 수 있다.
1. 회원 가입 정보 및 등록 내용에 허위, 기재누락, 오기가 있는 경우
2. 본 사이트에 회원 자격 제한 및 정지, 상실을 한 경험이 있었던 경우
3. 기타 회원으로 등록하는 것이 '힛갤' 의 서비스 운영 및 기술상 현저히 지장이 있다고 판단되는 경우
⑤ 타인의 정보를 도용하거나 허위의 정보를 등록하는 등 본인의 진정한 정보를 등록하지 않은 회원은 본 사이트 이용과 관련하여 아무런 권리를 주장할 수 없으며, 관계 법령에 따라 처벌 받을 수 있다.

제6조[개인정보처리방침]
① '힛갤' 및 운영진은 회원가입 시 제공한 개인정보 중 비밀번호를 가지고 있지 않으며 이와 관련된 부분은 본 사이트의 개인정보처리방침을 따른다.
② '힛갤' 회원의 개인정보보호에 관하여 관계법령 및 사이트가 정하는 개인정보처리방침에 정한 바에 따른다.
③ '힛갤' 운영진은 회원의 E-mail 및 고유 IP를 수집할 수 있으며 관계법령이 정하는 바에 따라 회원등록정보를 포함한 회원의 개인정보를 보호하기 위하여 노력한다. 단, 회원의 귀책사유로 인해 노출된 정보에 대해 운영진은 일체의 책임을 지지 않는다.
④ '힛갤' 운영진은 회원이 미풍양속에 저해되거나 국가안보에 위배되는 게시물 등 위법한 게시물을 등록 · 배포할 경우 관련기관의 요청이 있을 경우 관련기관에 '힛갤' 회원의 고유IP를 수집하거나 정보를 열람하게 할 수 있으며 해당 자료를 관련기관에 제출할 수 있다.

제7조[서비스의 제공 및 변경]
① '힛갤 '는 '힛갤' 회원에게 아래와 같은 서비스를 제공한다.
1. 커뮤니티 서비스 (게시판)
2. 검색 서비스
3. 기타 '힛갤' 가 자체 개발하거나 다른 회사와의 협력계약 등을 통해 '힛갤' 회원들에게 제공하는 일체의 서비스
② '힛갤' 는 본 사이트 서비스의 내용 및 제공일자를 회원에게 통지하고, 제1항에 정한 서비스를 변경하여 제공할 수 있다.

제8조[이용시간]
① '힛갤' 서비스 이용시간은 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 1일 24시간을 원칙으로 합니다. 단, '힛갤' 시스템 정기점검, 증설 및 교체를 위해 본 사이트 및 운영진이 정한 날이나 시간에 서비스를 일시중단 할 수 있으며 예정된 작업으로 인한 서비스 일시 중단은 사이트의 홈페이지에 사전에 공지한다.
② 제1항에 의한 서비스 중단의 경우에 '힛갤' 는 회원에게 사전 공지해야 한다. 단, '힛갤'를 통제할 수 없는 사유로 인한 서비스의 중단(시스템 관리자의 고의, 과실이 없는 디스크 장애, 시스템다운 등)으로 인하여 사전 통지가 불가능한 경우에는 사후 공지로 대체할 수 있다.

제9조[운영진의 의무]
① '힛갤' 는 본 사이트 서비스이용과 관련하여 발생하는 회원의 불만 또는 피해구제요청을 적절하게 처리할 수 있도록 필요한 인력 및 시스템을 구비한다.
② '힛갤' 는 본 사이트 서비스이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는 이를 처리해야 한다. '힛갤' 회원이 제기한 의견이나 불만사항에 대해서는 게시판을 활용하여 회원에게 처리과정 및 결과를 전달한다.
③ '힛갤' 운영진이 특정 회원 및 불특정다수 회원에 통지할 사항이 있는 경우 회원정보에 등록된 메일주소를 사용한다.

제10조[회원의 의무]
① '힛갤' 회원은 본 약관에서 규정하는 사항과 운영진이 정한 제반규정, 공지사항 및 운영정책 등 사이트가 공지하는 사항 및 관계법령을 준수하여야 하며, 기타 '힛갤' 의 업무에 방해가 되는 행위나 '힛갤' 및 운영진 명예를 손상시키는 행위를 금지한다.
② '힛갤' 회원은 '힛갤' 의 명시적 동의가 없는 한 서비스의 이용권한, 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없으며, 이를 담보로 제공할 수 없다.
③ '힛갤' 회원은 아이디 및 비밀번호 관리에 상당한 주의를 기울여야 하며, '힛갤' 의 동의 없이 제3자에게 아이디를 제공하여 이용하게 할 수 없다.
④ '힛갤' 회원은 '힛갤' 본 사이트, 운영진 및 제3자의 지적 재산권을 침해해서는 안된다.
⑤ '힛갤' 회원은 주기적으로 '힛갤' 의 공지사항을 확인하여야 한다. 공지사항 미확인으로 인한 피해 혹은 공지사항 미준수로 인한 책임은 회원 당사자에게 귀속되며, '힛갤' 는 이에 대해 책임지지 않는다.
⑥ '힛갤' 회원은 그 귀책사유로 인하여 '힛갤' 나 다른 회원이 입은 손해를 배상할 책임이 있다.

제11조[이용제한 및 징계]
① '힛갤' 의 공지사항에 위반하는 행위를 한 회원이 있을 경우 '힛갤'는 회원의 회원자격을 적절한 방법으로 제한 및 정지, 상실시킬 수 있다.
② '힛갤' 는 회원의 의무위반행위에 따른 다른 회원들의 선의의 피해를 방지하고 '힛갤' 운영상 필요하다고 판단하는 경우 징계대상자의 의무위반 내역과 아이디, 닉네임, IP를 전체 공개할 수 있다.
③ '힛갤'는 회원의 행위로 인한 피해가 발생하였을 경우 그 행위자에게 민․형사상 책임을 물을 수 있다.

제12조[탈퇴]
① '힛갤' 회원은 '힛갤' 에 언제든지 자신의 회원 등록 말소(이하 '회원 탈퇴')를 요청할 수 있으며 '힛갤' 는 위 요청을 받은 즉시 해당 회원의 회원 탈퇴를 위한 절차를 시행한다.
② '힛갤' 회원이 다음 각 호의 사유에 해당하는 경우, 힛갤는 회원자격을 적절한 방법으로 제한 및 정지, 상실시킬 수 있다.
1. 제10조에서 규정하고 있는 '회원의 의무'를 이행하지 않는 경우
2. 가입 신청 시에 허위 내용을 기재 및 등록한 경우
3. 본 서비스를 이용할 때 법령과 본 약관, 힛갤 내규가 금지하거나 공서양속에 반하는 행위를 하는 경우
③ 회원의 회원 탈퇴신청과 동시에 '힛갤' 가 제공하는 본 사이트 관련 프로그램이 회원관리 화면에서 자동적으로 영구 삭제된다. 그리하여 '힛갤' 는 더 이상 회원탈퇴 신청자의 정보를 볼 수 없다.

제13조[게시물 관리]
① '힛갤' 의 게시물과 자료의 관리 및 운영의 책임은 '힛갤' 운영진에게 있습니다. 운영진은 항상 불량 게시물 및 자료에 대하여 모니터링을 하여야 하며, 불량 게시물 및 자료를 발견하거나 신고를 받으면 해당 게시물 및 자료를 삭제하고 이를 게시 및 등록한 자에게 주의를 주어야 한다. 단, 이용회원이 올린 게시물에 대해서는 게시자 본인에게 책임이 있으니 회원 스스로 본 이용약관에서 위배되는 게시물은 게재해서는 안된다.
② 정보통신윤리위원회 등 공공기관의 시정요구가 있는 경우 운영진은 회원의 사전 동의 없이 게시물을 삭제하거나 이동 할 수 있습니다.
③ 불량게시물의 판단기준은 다음 각 호와 같다.
1. 다른 회원 또는 제3자에게 심한 모욕을 주거나 명예를 손상시키는 내용인 경우
2. 공공질서 및 미풍양속에 위반되는 내용을 유포하거나 링크시키는 경우
3. 불법복제 또는 해킹을 조장하는 내용인 경우
4. 영리를 목적으로 하는 광고일 경우
5. 범죄와 결부된다고 객관적으로 인정되는 내용일 경우
6. 다른 이용자 또는 제3자와 저작권 등 기타 권리를 침해하는 경우
7. 기타 관계법령에 위배된다고 판단되는 경우
④ '힛갤' 및 운영진은 게시물 등에 대하여 제3자로부터 명예훼손, 지적재산권 등의 권리 침해를 이유로 게시중단 요청을 받은 경우 이를 임시로 게시중단(전송중단)할 수 있으며, 게시중단 요청자와 게시물 등록자 간에 소송, 합의 기타 이에 준하는 관련기관의 결정 등이 이루어져 본 사이트에 접수된 경우 이에 따른다.

제14조[게시물의 보관]
운영진 불가피한 사정으로 본 '힛갤'를 중단하게 될 경우, '힛갤' 회원에게 사전 공지를 하고 게시물의 이전이 쉽도록 모든 조치를 취하기 위해 노력해야 한다.

제15조[게시물 저작권 관련]
① '힛갤' 회원은 동의 없이 게시물을 상업적으로 이용할 수 없다. 단, 비영리 목적인 경우는 그러하지 아니하며, 또한 서비스 내의 게재권을 갖는다.
② '힛갤' 회원은 '힛갤' 를 이용하여 취득한 정보를 임의 가공, 판매하는 행위 등 '힛갤' 에 게재된 자료를 상업적으로 사용할 수 없다.
③ '힛갤' 는 회원이 게시하거나 등록하는 '힛갤' 내의 내용물 및 게시 내용에 대해 제13조 각 호에 해당된다고 판단되는 경우 사전통지 없이 삭제하거나 이동 또는 등록 거부할 수 있다.

제16조[재정]
① '힛갤' 는 재정 건전성을 확보하기 위하여 기부금 모금, 광고 게재 등의 각종 재정적 조치를 취할 수 있다.
② 본조 제1항의 재정확보 조치들은 아이유 팬커뮤니티의  장기적‧안정적 운영이라는 본 목적을 훼손하지 않는 한에서만 가능하며, 개인의 영리적 목적으로는 절대 허용하지 않는다.

제17조[손해배상]
① '힛갤' 에서 발생한 모든 민.형법상 책임은 회원 본인에게 1차적으로 있다.
② '힛갤' 로부터 받은 회원의 손해가 천재지변 등 불가항력적인 경우 '힛갤' 및 운영진은 손해 배상을 하지 않는다.
③ '힛갤' 회원의 고의 또는 과실로 인하여 발생한 때에는 전적으로 회원 본인에게 책임이 있으므로 '힛갤' 및 운영진은 손해배상을 하지 않는다.

제18조 면책
① '힛갤'는 회원이 본 커뮤니티의 서비스 제공으로부터 기대되는 이익을 얻지 못하였거나 서비스 자료에 대한 취사선택 또는 이용으로 발생하는 손해 등에 대해서는 책임이 면제된다.
② '힛갤'는 본 커뮤니티의 서비스 기반 및 타 통신업자가 제공하는 전기통신서비스의 장애로 인한 경우에는 책임이 면제되며 본 사이트의 서비스 기반과 관련되어 발생한 손해에 대해서는 사이트의 이용약관에 준한다.
③ 운영진은 회원이 저장, 게시 또는 전송한 자료와 관련하여 일체의 책임을 지지 않는다.
④ 운영진은 회원의 귀책사유로 인하여 서비스 이용의 장애가 발생한 경우에는 책임지지 아니한다.
⑤ 운영진은 회원 상호간 또는 회원과 제3자 상호간, 기타 회원의 본 서비스 내외를 불문한 일체의 활동(데이터 전송, 기타 커뮤니티 활동 포함)에 대하여 책임을 지지 않는다.
⑥ 운영진은 회원이 게시 또는 전송한 자료 및 본 사이트로 회원이 제공받을 수 있는 모든 자료들의 진위, 신뢰도, 정확성 등 그 내용에 대해서는 책임지지 아니한다.
⑦ 운영진은 회원 상호간 또는 회원과 제3자 상호간에 서비스를 매개로 하여 물품거래 등을 한 경우에 그로부터 발생하는 일체의 손해에 대하여 책임지지 아니한다.
⑧ 운영진은 시삽의 귀책사유 없이 회원 간 또는 회원과 제3자간에 발생한 일체의 분쟁에 대하여 책임지지 아니한다.
⑨ 운영진은 서버 등 설비의 관리, 점검, 보수, 교체 과정 또는 소프트웨어의 운용 과정에서 고의 또는 고의에 준하는 중대한 과실 없이 발생할 수 있는 시스템의 장애, 제3자의 공격으로 인한 시스템의 장애, 국내외의 저명한 연구기관이나 보안관련 업체에 의해 대응방법이 개발되지 아니한  컴퓨터 바이러스 등의 유포나 기타 운영자가 통제할 수 없는 불가항력적 사유로 인한 회원의 손해에 대하여 책임지지 않는다.</div>
                </b-form-group>
                <b-form-group label='개인정보취급방침'>
                    <div class='termsBox'>1. 개인정보 수집목적 및 이용목적: 회원제 서비스 이용에 따른 본인 확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 고지사항 전달

2. 수집하는 개인정보 항목: 이름, 로그인 ID, 비밀번호, 이메일, 접속 IP

3. 개인정보의 보유기간 및 이용기간

원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.

- 관련 법령에 의한 정보보유 사유
o 로그 기록
- 보존 이유: 통신비밀보호법
- 보존 기간: 3개월</div>
                </b-form-group>
                <b-button variant='primary' @click='next'>
                    <font-awesome-icon icon='check'/>
                    동의합니다
                </b-button>
            </b-form>
        </div>
        <div v-else>
            <b-overlay
                :show='loading'
                rounded='sm'>
                <b-form @submit='onSubmit'>
                    <b-form-group>
                        <b-input-group class='mb-4 mr-sm-2 mb-sm-0'>
                            <b-input-group-prepend is-text>
                                <font-awesome-icon icon='user-circle'/>
                            </b-input-group-prepend>
                            <b-form-input
                                v-model='form.username'
                                :state='state.username'
                                placeholder='아이디'
                                autofocus/>
                        </b-input-group>
                    </b-form-group>
                    <b-form-group>
                        <b-input-group class='mb-2 mr-sm-2 mb-sm-0'>
                            <b-input-group-prepend is-text>
                                <font-awesome-icon icon='key'/>
                            </b-input-group-prepend>
                            <b-form-input
                                v-model='form.password'
                                type='password'
                                :state='state.password'
                                placeholder='비밀번호'/>
                        </b-input-group>
                    </b-form-group>
                    <b-form-group>
                        <b-input-group class='mb-2 mr-sm-2 mb-sm-0'>
                            <b-input-group-prepend is-text>
                                <font-awesome-icon icon='check'/>
                            </b-input-group-prepend>
                            <b-form-input
                                v-model='form.passwordConfirm'
                                type='password'
                                :state='state.passwordConfirm'
                                placeholder='비밀번호 확인'/>
                        </b-input-group>
                    </b-form-group>
                    <b-form-group>
                        <b-input-group class='mb-2 mr-sm-2 mb-sm-0'>
                            <b-input-group-prepend is-text>
                                <font-awesome-icon icon='envelope'/>
                            </b-input-group-prepend>
                            <b-form-input
                                v-model='form.email'
                                type='email'
                                :state='state.email'
                                placeholder='이메일'/>
                        </b-input-group>
                    </b-form-group>
                    <b-form-group>
                        <b-input-group class='mb-2 mr-sm-2 mb-sm-0'>
                            <b-input-group-prepend is-text>
                                <font-awesome-icon icon='tag'/>
                            </b-input-group-prepend>
                            <b-form-input
                                v-model='form.nickname'
                                :state='state.nickname'
                                placeholder='닉네임'/>
                        </b-input-group>
                    </b-form-group>
                    <b-form-group v-if='message'>
                        <b-form-invalid-feedback :state='false'>
                            {{ message }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                    <b-button type='submit' variant='primary'>회원가입</b-button>
                    <nuxt-link to='/signin'>
                        <b-button variant='link'>돌아가기</b-button>
                    </nuxt-link>
                </b-form>
            </b-overlay>
        </div>
    </div>
</template>

<script>
    export default {
        layout: 'sign',
        data() {
            return {
                step: 1,
                form: {
                    username: '',
                    password: '',
                    passwordConfirm: '',
                    email: '',
                    nickname: ''
                },
                state: {
                    username: null,
                    password: null,
                    passwordConfirm: null,
                    email: null,
                    nickname: null
                },
                message: null,
                loading: false
            }
        },
        methods: {
            async onSubmit(evt) {
                evt.preventDefault()
                if (this.loading)
                    return
                this.clear()
                if (this.form.username === '') {
                    this.state.username = false
                    return this.message = '아이디를 입력하세요.'
                } else if (this.form.password === '') {
                    this.state.password = false
                    return this.message = '비밀번호를 입력하세요.'
                } else if (this.form.passwordConfirm === '') {
                    this.state.passwordConfirm = false
                    return this.message = '비밀번호 확인을 입력하세요.'
                } else if (this.form.password !== this.form.passwordConfirm) {
                    this.state.password = false
                    this.state.passwordConfirm = false
                    return this.message = '비밀번호가 일치하지 않습니다.'
                } else if (this.form.email === '') {
                    this.state.email = false
                    return this.message = '이메일을 입력하세요.'
                } else if (this.form.nickname === '') {
                    this.state.nickname = false
                    return this.message = '닉네임을 입력하세요.'
                }
                this.loading = true
                const data = await this.$axios.$post('/api/auth/signup', {
                    username: this.form.username,
                    password: this.form.password,
                    email: this.form.email,
                    nickname: this.form.nickname
                })
                if (data.status === 'fail') {
                    this.loading = false
                    return this.message = data.message || '알 수 없는 오류가 발생했습니다. 나중에 다시 시도하세요.'
                }
                this.$router.push({ path: '/signin' })
            },
            clear() {
                this.state.username = null
                this.state.password = null
                this.state.passwordConfirm = null
                this.state.email = null
                this.state.nickname = null
            },
            next() {
                this.step = 2
            }
        }
    }
</script>

<style lang='less' scoped>
    @import '~/assets/stylesheets.less';
    
    .logo {
        text-decoration: none !important;
        > h1 {
            margin: 0 0 2rem;
            color: #FFF;
            // font-family: 'PricedownW00-Light';
            font-size: 5em;
            font-weight: bold;
            text-align: center;
            text-shadow: 5px 5px #000;
        }
    }
    
    .termsBox {
        height: 200px;
        padding: 15px;
        border: 1px solid #eee;
        background-color: #fcfcfc;
        font-size: 13px;
        white-space: pre-wrap;
        overflow-y: scroll;
    }
</style>