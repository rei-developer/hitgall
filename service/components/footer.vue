<template>
    <div>
        <article class='footer'>
            <div>
                <nuxt-link to='/'>
                    <img src='/icon.png'>
                </nuxt-link>
            </div>
            <div>
                <strong>
                    <nuxt-link to='/about'>
                        Copyright <font-awesome-icon icon='copyright'/> 2020 HitGall. All Rights Reserved.
                    </nuxt-link>
                </strong>
                <div>
                    <nuxt-link to='/board/notice'>공지사항</nuxt-link>
                    <span>|</span>
                    <nuxt-link to='/term'>이용약관</nuxt-link>
                    <span>|</span>
                    <nuxt-link to='/policy'>개인정보 취급방침</nuxt-link>
                    <span>|</span>
                    <nuxt-link to='/contact'>제휴문의</nuxt-link>
                </div>
            </div>
        </article>
    </div>
</template>

<style lang='less' scope>
    article.footer {
        display: flex;
        padding: 0 10px;
        > div {
            padding-top: 4px;
            width: 64px;
            > a > img {
                width: 48px;
                height: auto;
            }
            &:last-child {
                flex: 1;
                > strong > a {
                    color: #f7f7f7;
                    font-size: 14px;
                    text-decoration: none;
                    cursor: pointer;
                }
                > div {
                    margin-top: 10px;
                    color: #f7f7f7;
                    font-size: 11px;
                    > a {
                        color: #f7f7f7;
                        text-decoration: none;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>