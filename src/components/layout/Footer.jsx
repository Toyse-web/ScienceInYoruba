import React, {useContext} from "react";
import { Container, Row, Col } from "react-bootstrap";
import { LanguageContext } from "../../context/LanguageContext";

const Footer = () => {
    const {language, translations} = useContext(LanguageContext);
    const t = translations[language];

    return (
        <footer className="bg-dark text-light py-4 mt-5">
            <Container>
                <Row>
                    <Col md={4}>
                        <h5 className="text-yoruba">
                            {language === "yo" ? "Ìmọ̀ Ìjìnlẹ̀ ní Yorùbá" : "Science in Yorùbá"}
                        </h5>
                        <p className="small">
                            {language === "yo" ? "Ìgbìnyánjú láti ṣe ìmọ̀ sáyẹ́ǹsì dé títí fún gbogbo ènìyàn ní èdè Yorùbá." : "Making science education accessible to everyone in Yorùbá language."}
                        </p>
                    </Col>

                    <Col md={4}>
                        <h6>{language === "yo" ? "Ọ̀nà Ìbánisọ̀rọ̀" : "Quick Links"}</h6>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-light">{t.nav.home}</a></li>
                            <li><a href="/topics" className="text-light">{t.nav.topics}</a></li>
                            <li><a href="/articles" className="text-light">{t.nav.articles}</a></li>
                        </ul>
                    </Col>

                    <Col md={4}>
                        <h6>{language === "yo" ? "Ẹ ṣeun" : "Credits"}</h6>
                        <p className="small">
                            &copy; {new Date().getFullYear()} Science in Yorùbá. {
                                language === "yo" ? "Gbogbo ẹ̀tọ́ wà fún wọn." : "All rights reserved."
                            }
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;