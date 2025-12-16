import Link from "next/link"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"

// Constants
import { getBackgroundClass } from "@/define/colors"


export default function PrivacyPage() {
  return (
    <div className={`w-full ${getBackgroundClass('PRIMARY')} min-h-screen`}>
      <div className="px-6 py-6 max-w-6xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">ホーム</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>プライバシーポリシー</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="prose max-w-none">
          <h1 className="text-2xl font-bold mb-2">個人情報保護基本方針</h1>
          <p className="text-xs text-gray-600 mb-8">（プライバシーポリシー）</p>

          <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
            <p>
              株式会社あるやうむ（以下「当社」といいます。）は、当社が提供するサービスに関するお客様の個人情報の保護について、基本方針を定め、以下の方針に基づき適正に個人情報を取り扱います。
            </p>

            <p>
              この個人情報保護基本方針（プライバシーポリシー）で「個人情報」とは、個人情報の保護に関する法律（以下「個人情報保護法」といいます。）にいう「個人情報」を指すものとします。
            </p>

            <p>
              当社への個人情報の提供にあたっては、下記の内容にご同意の上、ご提供頂きますようにお願いします。
            </p>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第1条 (事業者情報)</h2>
              <div className="space-y-2 ml-4">
                <p>法人名 株式会社あるやうむ</p>
                <p>住所 札幌市北区北38条西6丁目2番23 カトラン麻生302号室</p>
                <p>代表者 代表取締役社長　畠中博晶</p>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第2条 (個人情報の取得方法)</h2>
              <div className="space-y-4">
                <p>1　当社は、当社のサービスを利用される方およびお問い合わせ等を頂いた方より、適正かつ公正な手段によって、個人情報を取得します。</p>
                <p>2　当社が取得する主な情報は、次のとおりです。</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>会員登録・認証に関する情報（氏名、住所、電話番号、メールアドレス、ID・パスワード、生年月日等）</li>
                  <li>注文・決済・配送等に関する情報（注文内容、配送先、受取情報、決済手段・承認結果等）</li>
                  <li>取引連絡・サポートに関する情報（お問い合わせ内容、取引メッセージ、レビュー・評価等）</li>
                  <li>アクセスに関する技術情報（IPアドレス、端末情報、ブラウザ情報、Cookie・広告ID等の個人関連情報、ログ情報等）</li>
                  <li>NFTその他デジタル商品に関する情報（ウォレットアドレス、トランザクション情報等）</li>
                </ol>
                <p>3　機微な個人情報については、当社の業務の遂行上必要な範囲外のものを取得しません。</p>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第3条 (個人情報の利用目的)</h2>
              <p className="mb-4">当社が個人情報を利用する目的は、次のとおりです。</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>商品の販売、デジタルコンテンツ（NFTを含む）の提供、決済、発送、返品・返金、アフターサポートの遂行</li>
                <li>出店事業者との取引仲介・連絡、当該事業者による契約履行（発送・サポート等）に必要な情報連携</li>
                <li>アカウントの登録・認証・本人確認（必要に応じて）、ログイン管理、セッション維持、セキュリティ対策</li>
                <li>不正利用の防止・調査（なりすまし・チャージバック・複数アカウント作成等の検知・抑止を含む）</li>
                <li>当社サービスに関するお知らせの送付、キャンペーンその他のご案内、広告配信・効果測定</li>
                <li>サービス品質の改善、新機能の企画開発、統計データの作成（匿名加工情報又は仮名加工情報の活用を含む）</li>
                <li>問い合わせ・苦情・紛争対応および権利行使のため</li>
                <li>法令・ガイドラインに基づく対応、会計・税務・監査等の法定義務の履行のため</li>
                <li>NFTに関する特記事項：ブロックチェーン上の取引記録は公開され原則として削除できないことの周知及び関連する連携処理のため</li>
              </ol>
              <p className="mt-4">
                上記の利用目的は、相当の関連性を有すると合理的に認められる範囲内で変更することがあります。上記の利用目的を変更する場合には、その内容をホームページ等により公表します。
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第4条 (個人データの安全管理に関する基本方針)</h2>
              <div className="space-y-4">
                <p>
                  当社は、個人情報を正確かつ最新の内容に保つよう努め、組織的・人的・物理的・技術的安全管理措置を講じることにより、不正アクセス、改ざん、漏えい、滅失および毀損等の防止に努めます。
                </p>
                <p>
                  2　万一、漏えい等の事態が発生し又は発生のおそれがある場合、当社は、関連法令・ガイドラインに従い、原因究明、影響評価、必要に応じた監督当局への報告及びご本人への通知、並びに再発防止策の実施等、適切に対応します。
                </p>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第5条 (外部委託)</h2>
              <p>
                当社は、情報処理、決済代行、配送・物流、カスタマーサポート、広告配信・効果測定、アクセス解析、メール配信、クラウド・CDN等の業務を外部に委託する際に、当該受託者に対して個人情報を提供することがあります。この場合、委託先が個人情報保護体制を確保していることを条件とし、必要かつ適切な監督を行います。海外所在の受託者に委託する場合は、第6条の3に定める取扱いに従います。
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第6条 (個人情報の第三者提供)</h2>
              <div className="space-y-4">
                <p>
                  当社は、次に掲げる場合を除き、あらかじめご本人の同意を得ることなく、個人データを第三者に提供しません。
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>法令に基づく場合</li>
                  <li>人の生命、身体又は財産の保護のために必要がある場合であって、ご本人の同意を得ることが困難であるとき</li>
                  <li>公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、ご本人の同意を得ることが困難であるとき</li>
                  <li>国の機関若しくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、同意取得により当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                  <li>事業の承継に伴って個人データが提供される場合</li>
                </ol>
                <p>
                  2　第三者提供を行った場合には、個人情報保護法に定める確認・記録作成・保存の義務を履行します。
                </p>
                <p>
                  3　委託（第5条）、共同利用（第6条の2）及び外国にある第三者への提供（第6条の3）は、法令上の第三者提供に該当しない場合があります。
                </p>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第6条の2（共同利用）</h2>
              <p className="mb-4">当社は、以下のとおり共同利用を行います。</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>共同利用する個人情報の項目：氏名、住所、生年月日、電話番号、メールアドレス、配送先、注文・決済・配送・問い合わせ履歴、レビュー・評価、アカウント識別子、ウォレットアドレス（NFT関連の場合）等</li>
                <li>共同利用者の範囲：当社が運営するマーケットプレイスに出店する事業者</li>
                <li>共同利用の目的：販売契約の履行（発送・サポート等）、取引連絡、不正利用防止及びサービス品質の改善</li>
                <li>管理責任者：株式会社あるやうむ（住所：札幌市北区北38条西6丁目2番23 カトラン麻生302号室、代表者：代表取締役社長 畠中博晶）</li>
              </ol>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第6条の3（外国にある第三者への提供）</h2>
              <p>
                当社は、クラウド、CDN、決済、広告配信・効果測定、アクセス解析、カスタマーサポートその他のサービス提供において、外国にある第三者に個人データを提供し、又は保管・処理を委託する場合があります。この場合、当社は、個人情報保護法その他の法令に従い、当該外国の名称、当該国の個人情報保護制度の概要、受領者における個人情報の保護措置等の情報を本人に提供し、必要に応じて同意を取得するなど、適切な措置を講じます。
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第7条 (匿名加工情報に関する取扱い)</h2>
              <p className="mb-4">当社は、匿名加工情報（特定の個人を識別できないように個人情報を加工し、復元できないようにしたもの）を作成する場合、以下の対応を行います。</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>法令で定める基準に従い適正な加工を施す。</li>
                <li>法令で定める基準に従い安全管理措置を講じる。</li>
                <li>匿名加工情報に含まれる個人に関する情報の項目を公表する。</li>
                <li>本人の識別を目的として他の情報と照合しない。</li>
              </ol>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第7条の2（仮名加工情報の取扱い）</h2>
              <p>
                当社は、サービスの品質改善や分析等の目的で仮名加工情報を作成・利用することがあります。この場合、仮名加工情報は安全管理措置の下で取り扱い、再識別を目的とした照合を行いません。また、仮名加工情報は、本人の求めに応じた利用停止等の対象とならない場合があります。
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第8条（個人情報の開示）</h2>
              <div className="space-y-4">
                <p>
                  当社は、お客様から個人情報の開示を求められたときは、当該請求が個人情報保護法上理由のあるものと認められる場合、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないことがあり、開示しない決定をした場合には、その旨を遅滞なく通知します。なお、個人情報の開示に際しては、1件あたり1,000円の事務手数料を申し受けます。
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合。</li>
                  <li>当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合。</li>
                  <li>その他法令に違反することとなる場合。</li>
                </ol>
                <p>
                  2　利用目的の通知の求めについても、法令に従い適切に対応します。
                </p>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第9条（個人情報の訂正および削除）</h2>
              <div className="space-y-4">
                <p>
                  1　お客様は、当社の保有する自己の個人情報が誤っている場合には、当社所定の手続により、当社に対して個人情報の訂正、追加または削除（以下「訂正等」といいます。）を請求することができます。
                </p>
                <p>
                  2　当社は、お客様からの前項の請求を受け、当該請求が個人情報保護法上理由のあるものと認められる場合には、遅滞なく、当該個人情報の訂正等を行います。
                </p>
                <p>
                  3　当社は、前項に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをお客様に通知します。
                </p>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第10条（個人情報の利用停止等）</h2>
              <div className="space-y-4">
                <p>
                  1　当社は、本人から、個人情報の利用の停止または消去（以下「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。
                </p>
                <p>
                  2　前項の調査結果に基づき、当該請求が個人情報保護法上理由のあるものと認められる場合には、遅滞なく、当該個人情報の利用停止等を行います。
                </p>
                <p>
                  3　当社は、前項に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをお客様に通知します。
                </p>
                <p>
                  4　前二項にかかわらず、利用停止等に多額の費用を要する場合その他利用停止等を行うことが困難な場合であって、お客様の権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じます。
                </p>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第11条（個人情報の取扱いに関する苦情・相談窓口）</h2>
              <p className="mb-4">
                当社は、個人情報保護のための関連法令およびその他の規範を遵守し、個人情報の取扱いに関する苦情・相談に迅速に対応します。
              </p>
              <p>
                （問い合わせ先）株式会社あるやうむ　〒001-0038 札幌市北区北38条西6丁目2番23 カトラン麻生302号室
              </p>
              <p>
                TEL：（070）8438-3542　Mail：お問い合わせフォーム
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第12条 (SSL（Secure Socket Layer）について)</h2>
              <p>
                当社のWebサイトはSSLに対応しており、WebブラウザとWebサーバーとの通信を暗号化しています。
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第13条（Cookie等の利用及び個人関連情報の第三者提供）</h2>
              <div className="space-y-4">
                <p>
                  Cookieとは、ウェブサイトを訪問するとき、お客様のコンピュータや端末に保存される小さなテキストファイルです。当社は、以下の目的でCookieや類似のウェブ追跡技術（ウェブビーコン、ピクセル、広告ID等）を使用する場合があります。
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>ログイン状態の保持、訪問者の認証、セッションの維持、セキュリティ対策のため</li>
                  <li>言語等の設定内容や最終訪問日時等の記憶による利便性向上のため</li>
                  <li>訪問回数や利用形態の把握、サービス改善・効果測定のため</li>
                  <li>お客様の関心に沿った広告の配信、広告効果の計測のため</li>
                </ul>
                <p>
                  2　当社は、広告配信やアクセス解析等の目的で、Cookieや広告ID等の個人関連情報を第三者（広告配信事業者、解析事業者等）に送信・提供する場合があります。当該第三者がこれらの情報を個人データとして取得することが想定される場合には、法令に従い、必要な事項の事前の情報提供を行い、必要に応じて同意を取得します。
                </p>
                <p>
                  3　ブラウザの設定や当社が提供するクッキー設定画面により、Cookieの受け入れを制御することができます。お客様がCookieを無効化又は制限する場合、ウェブサイトの全部または一部の機能をご利用いただけない可能性があります。
                </p>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第14条 (基本方針の継続的改善)</h2>
              <p>
                当社は、個人情報の取扱いに関して、定期的に監査を行い、常に継続的改善に努めます。
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">第15条（本ポリシーの変更）</h2>
              <p>
                当社は、必要に応じて、本ポリシーの内容を変更することができます。変更時は、ホームページ上に変更の内容を表示し、必要に応じてバナー掲示又はメール等により告知します。
              </p>
            </section>

            <section className="mt-6">
              <p className="mb-2 text-sm">(掲載ホームページ)</p>
              <p className="mb-4 text-sm">
                <a href="https://tokken.alyawmu.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  https://tokken.alyawmu.com/
                </a>
              </p>
              <div className="border-t pt-4 mt-6">
                <p className="text-xs font-semibold mb-2">（附則）</p>
                <p className="text-xs">2022年10月14日　制定</p>
                <p className="text-xs">2023年05月23日　改定</p>
                <p className="text-xs">2025年11月01日　改定</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
