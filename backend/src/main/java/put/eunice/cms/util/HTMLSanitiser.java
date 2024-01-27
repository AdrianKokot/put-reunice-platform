package put.eunice.cms.util;

import java.util.*;
import net.htmlparser.jericho.*;

public class HTMLSanitiser {
    private HTMLSanitiser() {} // not instantiable

    // list of HTML elements that will be retained in the final output:
    private static final Set<String> VALID_ELEMENT_NAMES =
            new HashSet<>(
                    List.of(
                            HTMLElementName.SCRIPT,
                            HTMLElementName.A,
                            HTMLElementName.ABBR,
                            HTMLElementName.ADDRESS,
                            HTMLElementName.ARTICLE,
                            HTMLElementName.ASIDE,
                            HTMLElementName.AUDIO,
                            HTMLElementName.BDI,
                            HTMLElementName.BDO,
                            HTMLElementName.BLOCKQUOTE,
                            HTMLElementName.BR,
                            HTMLElementName.CAPTION,
                            HTMLElementName.CITE,
                            HTMLElementName.CODE,
                            HTMLElementName.COL,
                            HTMLElementName.COLGROUP,
                            HTMLElementName.DD,
                            HTMLElementName.DEL,
                            HTMLElementName.DETAILS,
                            HTMLElementName.DFN,
                            HTMLElementName.DIV,
                            HTMLElementName.DL,
                            HTMLElementName.DT,
                            HTMLElementName.EM,
                            HTMLElementName.FIELDSET,
                            HTMLElementName.FIGCAPTION,
                            HTMLElementName.FIGURE,
                            HTMLElementName.H1,
                            HTMLElementName.H2,
                            HTMLElementName.H3,
                            HTMLElementName.H4,
                            HTMLElementName.H5,
                            HTMLElementName.H6,
                            HTMLElementName.HEADER,
                            HTMLElementName.HGROUP,
                            HTMLElementName.HR,
                            HTMLElementName.I,
                            HTMLElementName.IFRAME,
                            HTMLElementName.IMG,
                            HTMLElementName.KBD,
                            HTMLElementName.LABEL,
                            HTMLElementName.LEGEND,
                            HTMLElementName.LI,
                            HTMLElementName.LINK,
                            HTMLElementName.MARK,
                            HTMLElementName.OL,
                            HTMLElementName.OUTPUT,
                            HTMLElementName.P,
                            HTMLElementName.PRE,
                            HTMLElementName.Q,
                            HTMLElementName.RP,
                            HTMLElementName.RT,
                            HTMLElementName.RUBY,
                            HTMLElementName.S,
                            HTMLElementName.SAMP,
                            HTMLElementName.SECTION,
                            HTMLElementName.SPAN,
                            HTMLElementName.STRONG,
                            HTMLElementName.SUB,
                            HTMLElementName.SUMMARY,
                            HTMLElementName.SUP,
                            HTMLElementName.TABLE,
                            HTMLElementName.TBODY,
                            HTMLElementName.TD,
                            HTMLElementName.TIME,
                            HTMLElementName.TFOOT,
                            HTMLElementName.TH,
                            HTMLElementName.THEAD,
                            HTMLElementName.TR,
                            HTMLElementName.U,
                            HTMLElementName.UL,
                            HTMLElementName.WBR));

    // list of HTML attributes that will be retained in the final output:
    private static final Set<String> VALID_ATTRIBUTE_NAMES =
            new HashSet<>(Arrays.asList("id", "class", "href", "target", "title", "style"));

    private static final Object VALID_MARKER = new Object();

    public static String encodeInvalidMarkup(String pseudoHTML) {
        return encodeInvalidMarkup(pseudoHTML, false);
    }

    public static String encodeInvalidMarkup(String pseudoHTML, boolean formatWhiteSpace) {
        return sanitise(pseudoHTML, formatWhiteSpace, false);
    }

    public static String stripInvalidMarkup(String pseudoHTML) {
        return stripInvalidMarkup(pseudoHTML, false);
    }

    public static String stripInvalidMarkup(String pseudoHTML, boolean formatWhiteSpace) {
        return sanitise(pseudoHTML, formatWhiteSpace, true);
    }

    private static String sanitise(
            String pseudoHTML, boolean formatWhiteSpace, boolean stripInvalidElements) {
        Source source = new Source(pseudoHTML);
        source.fullSequentialParse();
        OutputDocument outputDocument = new OutputDocument(source);
        List<Tag> tags = source.getAllTags();
        int pos = 0;
        for (Tag tag : tags) {
            if (tag.getBegin() < pos) continue; // this might happen if a script element was encountered
            if (processTag(tag, outputDocument)) {
                tag.setUserData(VALID_MARKER);
            } else {
                if (!stripInvalidElements) continue; // element will be encoded along with surrounding text
                if (tag.getName() == HTMLElementName.SCRIPT && tag.getTagType() == StartTagType.NORMAL) {
                    EndTag endTag = tag.getElement().getEndTag();
                    if (endTag == null) {
                        // script has no end tag, remove everything to the end of the source and don't process
                        // any more tags
                        outputDocument.remove(tag.getBegin(), source.getEnd());
                        return outputDocument.toString();
                    }
                    // remove the whole script element including tags and content
                    outputDocument.remove(tag.getBegin(), endTag.getEnd());
                    pos = endTag.getEnd();
                    continue;
                }
                outputDocument.remove(tag);
            }
            reencodeTextSegment(source, outputDocument, pos, tag.getBegin(), formatWhiteSpace);
            pos = tag.getEnd();
        }
        reencodeTextSegment(source, outputDocument, pos, source.getEnd(), formatWhiteSpace);
        return outputDocument.toString();
    }

    private static boolean processTag(Tag tag, OutputDocument outputDocument) {
        String elementName = tag.getName();
        if (!VALID_ELEMENT_NAMES.contains(elementName)) return false;
        if (tag.getTagType() == StartTagType.NORMAL) {
            Element element = tag.getElement();
            if (HTMLElements.getEndTagRequiredElementNames().contains(elementName)) {
                if (element.getEndTag() == null)
                    return false; // reject start tag if its required end tag is missing
            } else if (HTMLElements.getEndTagOptionalElementNames().contains(elementName)) {
                if (Objects.equals(elementName, HTMLElementName.LI) && !isValidLITag(tag))
                    return false; // reject invalid LI tags
                if (element.getEndTag() == null)
                    outputDocument.insert(
                            element.getEnd(),
                            getEndTagHTML(elementName)); // insert optional end tag if it is missing
            }
            outputDocument.replace(tag, getStartTagHTML(element.getStartTag()));
        } else if (tag.getTagType() == EndTagType.NORMAL) {
            if (tag.getElement() == null)
                return false; // reject end tags that aren't associated with a start tag
            if (Objects.equals(elementName, HTMLElementName.LI) && !isValidLITag(tag))
                return false; // reject invalid LI tags
            outputDocument.replace(tag, getEndTagHTML(elementName));
        } else {
            return false; // reject abnormal tags
        }
        return true;
    }

    private static boolean isValidLITag(Tag tag) {
        Element parentElement = tag.getElement().getParentElement();
        if (parentElement == null) return false; // ignore LI elements without a parent
        if (parentElement.getStartTag().getUserData() != VALID_MARKER)
            return false; // ignore LI elements who's parent is not valid
        return Objects.equals(parentElement.getName(), HTMLElementName.UL)
                || Objects.equals(
                        parentElement.getName(),
                        HTMLElementName.OL); // only accept LI tags who's immediate parent is UL or OL.
    }

    private static void reencodeTextSegment(
            Source source, OutputDocument outputDocument, int begin, int end, boolean formatWhiteSpace) {
        if (begin >= end) return;
        Segment textSegment = new Segment(source, begin, end);
        String decodedText = CharacterReference.decode(textSegment);
        String encodedText =
                formatWhiteSpace
                        ? CharacterReference.encodeWithWhiteSpaceFormatting(decodedText)
                        : CharacterReference.encode(decodedText);
        outputDocument.replace(textSegment, encodedText);
    }

    private static CharSequence getStartTagHTML(StartTag startTag) {
        // tidies and filters out non-approved attributes
        StringBuilder sb = new StringBuilder();
        sb.append('<').append(startTag.getName());
        for (Attribute attribute : startTag.getAttributes()) {
            if (VALID_ATTRIBUTE_NAMES.contains(attribute.getKey())) {
                sb.append(' ').append(attribute.getName());
                if (attribute.getValue() != null) {
                    sb.append("=\"");
                    sb.append(CharacterReference.encode(attribute.getValue()));
                    sb.append('"');
                }
            }
        }
        if (startTag.getElement().getEndTag() == null
                && !HTMLElements.getEndTagOptionalElementNames().contains(startTag.getName()))
            sb.append(" /");
        sb.append('>');
        return sb;
    }

    private static String getEndTagHTML(String tagName) {
        return "</" + tagName + '>';
    }
}
